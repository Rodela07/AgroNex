// AgroNex Bangladesh - Serverless Gemini AI Backend
// Securely proxies AI queries to Google Gemini 1.5 Flash without exposing secrets to the client.

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health-check endpoint
  if (req.method === 'GET') {
    const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0;
    return res.status(200).json({
      status: 'online',
      service: 'AgroNex AI Serverless Engine',
      geminiConfigured: hasKey,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      version: '2.0.0'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim().length === 0) {
    return res.status(503).json({
      success: false,
      error: 'GEMINI_API_KEY is not configured in Vercel Environment Variables. Falling back to offline expert engine.',
      isDemoMode: true
    });
  }

  const { message, history = [], responseLanguage = 'auto' } = req.body || {};

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Missing or empty message parameter.' });
  }

  // 1. Language Detection & Target Resolution
  const rawQuery = message.trim();
  const hasBengaliScript = /[\u0980-\u09FF]/.test(rawQuery);
  const banglishMarkers = /(amar|amr|dhan|gach|pata|holud|goru|khabar|khacche|durbol|mach|pukur|upore|uthe|poka|murgi|sar|koto|ki|korbo|keno|hoye|hocche|dhorse|lagbe)/i.test(rawQuery);

  let targetLang: 'bn' | 'en' = 'bn';
  if (responseLanguage === 'en') {
    targetLang = 'en';
  } else if (responseLanguage === 'bn') {
    targetLang = 'bn';
  } else {
    // Auto detect: Bengali script or Banglish -> natural Bengali
    targetLang = hasBengaliScript || banglishMarkers ? 'bn' : 'en';
  }

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

  const AGRONEX_SYSTEM_PROMPT = `You are AgroNex AI (এগ্রোনেক্স এআই কৃষি সহকারী), an elite agricultural, livestock, fisheries, and market intelligence specialist tailored for Bangladesh.

YOUR CORE CAPABILITIES & IDENTITY:
1. Multilingual Understanding: You seamlessly understand Bengali script (বাংলা), Romanized Bengali (Banglish, e.g. "Amar dhan er pata holud hoye jacche", "Goru khabar khacche na ki korbo"), English, and mixed colloquial sentences.
2. Language Output Rules:
   - Target Output Language for this query: ${targetLang === 'bn' ? 'বাংলা (Bengali)' : 'English'}.
   - If the output language is Bengali, reply in simple, natural, conversational Bengali that rural Bangladeshi farmers easily understand. Use colloquial words ('সার', 'পোকা', 'সেচ', 'পুকুর', 'খাবার').
   - If English, reply in clear English mentioning BARC, BRRI, BARI, BLRI, decimals, and maund benchmarks.
3. Agricultural Accuracy:
   - Rice/Paddy: BRRI recommended varieties (BRRI dhan-28, 29, 89, 92), Boro fertilizer per decimal (Urea 1kg in 3 splits, TSP 450g, MoP 550g).
   - Potato: Late blight preventive (Mancozeb 2g/L) vs curative (Ridomil Gold / Secure 2g/L).
   - Cattle: Normal temperature 101.5°F - 102.5°F. FMD warning (mouth/foot blisters, stringy salivation). UMS for beef fattening (target FCR 5.0 - 6.0).
   - Fisheries: Dissolved oxygen depletion (DO < 3mg/L), emergency aeration, oxygen tablets (10-15g/dec), zeolite for ammonia.
4. Professional Safety & Ethics:
   - NEVER hallucinate dangerous chemical dosages or unverified medicines.
   - Ask clarifying follow-up questions when crucial info is missing (crop age, pond depth, animal temperature).
   - For critical health crises, suspected poisoning, or infectious outbreaks (like FMD or Anthrax), mark as EMERGENCY: [EMERGENCY:true] and advise consulting certified BCS Agronomists or DVM Veterinarians.

OUTPUT FORMATTING:
- Give a direct answer with probable causes.
- Give step-by-step practical guidance.
- If emergency, include tag: [EMERGENCY:true]
- If relevant tool in AgroNex, include one action tag:
  [ACTION:fertilizer] -> for land & fertilizer calculations
  [ACTION:vet_booking] -> for livestock diseases and doctors
  [ACTION:expert_booking] -> for fisheries & agronomists
  [ACTION:market_prices] -> for wholesale rates
  [ACTION:troubleshooter] -> for pest & disease troubleshooting`;

  // Build Gemini contents payload
  const contents: any[] = [];

  // Recent history (last 6 turns)
  if (Array.isArray(history) && history.length > 0) {
    const recent = history.slice(-6);
    for (const msg of recent) {
      if (msg && msg.text) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }
  }

  // Current query
  contents.push({
    role: 'user',
    parts: [{ text: rawQuery }]
  });

  try {
    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: AGRONEX_SYSTEM_PROMPT }]
        },
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1024
        }
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API call failed:', geminiRes.status, errText);
      return res.status(geminiRes.status).json({
        success: false,
        error: `Gemini API returned status ${geminiRes.status}`,
        details: errText,
        isDemoMode: true
      });
    }

    const json = await geminiRes.json();
    const rawAnswer = json.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!rawAnswer) {
      return res.status(502).json({
        success: false,
        error: 'Empty response returned by Gemini model.',
        isDemoMode: true
      });
    }

    // Parse emergency and action tags
    let isEmergency = false;
    let cleanedText = rawAnswer;

    if (cleanedText.includes('[EMERGENCY:true]')) {
      isEmergency = true;
      cleanedText = cleanedText.replace(/\[EMERGENCY:true\]/g, '').trim();
    }

    let actionCard: any = undefined;
    const actionMatch = cleanedText.match(/\[ACTION:(fertilizer|vet_booking|expert_booking|market_prices|troubleshooter)\]/);
    if (actionMatch) {
      const actionType = actionMatch[1];
      cleanedText = cleanedText.replace(/\[ACTION:[a-z_]+\]/g, '').trim();

      switch (actionType) {
        case 'fertilizer':
          actionCard = {
            type: 'fertilizer',
            labelBn: 'সার ক্যালকুলেটরে সরাসরি হিসাব দেখুন',
            labelEn: 'Open Fertilizer Calculator',
            tab: 'agriculture',
            subtab: 'calculator'
          };
          break;
        case 'vet_booking':
          actionCard = {
            type: 'vet_booking',
            labelBn: 'রেজিস্টার্ড পশু ডাক্তারের সাথে কথা বলুন',
            labelEn: 'Consult Veterinary Surgeon',
            tab: 'experts'
          };
          break;
        case 'expert_booking':
          actionCard = {
            type: 'expert_booking',
            labelBn: 'বিসিএস মৎস্য/কৃষি কর্মকর্তার পরামর্শ নিন',
            labelEn: 'Consult Agricultural Specialist',
            tab: 'experts'
          };
          break;
        case 'market_prices':
          actionCard = {
            type: 'market_prices',
            labelBn: 'আজকের পাইকারি বাজারদর দেখুন',
            labelEn: 'View Live Market Rates',
            tab: 'prices'
          };
          break;
        case 'troubleshooter':
          actionCard = {
            type: 'fertilizer',
            labelBn: 'রোগ ও বালাই নির্দেশিকা দেখুন',
            labelEn: 'Open Pest Troubleshooter',
            tab: 'agriculture',
            subtab: 'troubleshooter'
          };
          break;
      }
    }

    return res.status(200).json({
      success: true,
      reply: cleanedText,
      isEmergency,
      actionCard,
      provider: 'Google Gemini (Server-Secured)',
      model,
      detectedLanguage: hasBengaliScript ? 'bn' : (banglishMarkers ? 'banglish' : 'en'),
      dominantLanguage: targetLang
    });

  } catch (error: any) {
    console.error('Server error calling Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while querying Gemini.',
      isDemoMode: true
    });
  }
}
