// AgroNex Bangladesh - Serverless Gemini AI Backend
// Uses official @google/genai SDK to securely query Gemini without exposing secrets to the client.

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

interface ChatHistoryItem {
  id?: string;
  sender: 'user' | 'ai';
  text: string;
}

/**
 * Safely resolves GEMINI_API_KEY from environment or local env files.
 */
function resolveGeminiApiKey(): string | undefined {
  if (process.env.GEMINI_API_KEY !== undefined) {
    const trimmed = process.env.GEMINI_API_KEY.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  // Fallback for local development if process.env was not populated by shell
  const candidatePaths = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), 'src', '.env.local'),
    path.resolve(process.cwd(), '.env')
  ];

  for (const envPath of candidatePaths) {
    try {
      if (fs.existsSync(envPath)) {
        const raw = fs.readFileSync(envPath, 'utf8');
        const match = raw.match(/GEMINI_API_KEY\s*=\s*([^\r\n]+)/);
        if (match && match[1].trim().length > 0) {
          const key = match[1].trim();
          process.env.GEMINI_API_KEY = key; // cache for process
          return key;
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  return undefined;
}

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = resolveGeminiApiKey();

  // Health-check endpoint: verify backend availability without exposing secrets
  if (req.method === 'GET') {
    const isConfigured = !!apiKey && apiKey.length > 0;
    return res.status(200).json({
      status: 'online',
      service: 'AgroNex Serverless AI Backend',
      sdk: '@google/genai',
      geminiConfigured: isConfigured,
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      version: '3.8.0'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      error: 'Only POST requests are accepted.'
    });
  }

  // 1. Validate API Key from Server Environment
  if (!apiKey || apiKey.length === 0) {
    console.warn('[AgroNex Serverless] GEMINI_API_KEY is not configured on server.');
    return res.status(503).json({
      success: false,
      code: 'API_NOT_CONFIGURED',
      error: 'GEMINI_API_KEY is not configured in server environment variables. Please add GEMINI_API_KEY in Vercel Project Settings.',
      isDemoMode: false
    });
  }

  // 2. Validate Request Body
  const { message, history = [], responseLanguage = 'auto' } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      code: 'EMPTY_MESSAGE',
      error: 'Message parameter is required and must be a string.'
    });
  }

  const rawQuery = message.trim();
  if (rawQuery.length === 0) {
    return res.status(400).json({
      success: false,
      code: 'EMPTY_MESSAGE',
      error: 'Message cannot be empty.'
    });
  }

  // Reject excessively long messages (prevent denial of service and token exhaustion)
  if (rawQuery.length > 2000) {
    return res.status(400).json({
      success: false,
      code: 'MESSAGE_TOO_LONG',
      error: 'Message exceeds the maximum allowed limit of 2,000 characters.'
    });
  }

  // 3. Language & Intent Resolution
  const hasBengaliScript = /[\u0980-\u09FF]/.test(rawQuery);
  const banglishMarkers = /(amar|amr|dhan|gach|pata|holud|goru|khabar|khacche|durbol|mach|pukur|upore|uthe|poka|murgi|sar|koto|ki|korbo|keno|hoye|hocche|dhorse|lagbe)/i.test(rawQuery);

  let targetLang: 'bn' | 'en' = 'bn';
  if (responseLanguage === 'en') {
    targetLang = 'en';
  } else if (responseLanguage === 'bn') {
    targetLang = 'bn';
  } else {
    // Auto detect: Bengali script or Banglish -> natural colloquial Bengali for rural farmers
    targetLang = hasBengaliScript || banglishMarkers ? 'bn' : 'en';
  }

  // Model prioritization: gemini-3.8-flash is current production default
  const requestedModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const candidateModels = [requestedModel, 'gemini-3.8-flash', 'gemini-3.5-flash'].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  const AGRONEX_SYSTEM_PROMPT = `You are AgroNex AI (এগ্রোনেক্স এআই কৃষি সহকারী), a dedicated multilingual agricultural assistant designed to help ordinary farmers and agricultural communities in Bangladesh.

YOUR PURPOSE:
Help farmers with practical, understandable information about crop agriculture, livestock, fisheries, and agricultural marketing.

LANGUAGE UNDERSTANDING & OUTPUT RULES:
- Target Output Language for this query: ${targetLang === 'bn' ? 'বাংলা (Bengali)' : 'English'}.
- Understand Bengali script, English, Banglish, mixed-language messages, informal spelling, phonetic Bengali, and common spelling mistakes.
- Automatically detect the user's language.
- If the user writes in Banglish, normally respond in simple Bengali script.
- If the user writes in English, respond in English.
- Respect the user's explicit language preference.
- Never reject a question simply because its spelling or grammar is incorrect. Understand the farmer's real problem, not just match keywords.

FOUR CORE KNOWLEDGE DOMAINS:
1. AGRICULTURE: Crops, seeds, soil, irrigation, fertilizer, pests, diseases, harvesting, and cultivation (Follow BARC, BRRI, and BARI standards).
2. LIVESTOCK: Cattle, goats, poultry, animal nutrition, vaccination, disease prevention, and veterinary care (Follow BLRI and DLS guidelines).
3. FISHERIES: Pond management, fish species, fingerlings, feeding, water quality, oxygen, and fish diseases (Follow BFRI and DoF recommendations).
4. MARKETPLACE: Selling agricultural produce, listing products, finding buyers, negotiation, and regional market information.

ANSWER STYLE:
- Use simple, friendly language suitable for ordinary Bangladeshi farmers (আঞ্চলিক কৃষকদের উপযোগী সহজ-সরল ভাষা).
- Give practical steps in a clear order (ধাপে ধাপে করণীয়).
- Explain unfamiliar technical terms in plain terms.
- Ask follow-up questions when important details (crop stage, land area, animal temperature, water depth) are missing.
- Do not give generic answers when the question contains specific symptoms or circumstances.
- Never claim that an uncertain diagnosis is confirmed.

SAFETY & INTEGRITY:
- NEVER invent medicine doses, pesticide quantities, fertilizer rates, or market prices.
- Ask for crop type, growth stage, location, symptoms, and relevant details when needed.
- For serious animal illness, suspected poisoning, severe fish mortality, or dangerous outbreaks, recommend urgent help from qualified professionals and mark as EMERGENCY: [EMERGENCY:true].
- Never present AI output as a replacement for a qualified agricultural or veterinary expert.
- If reliable information is unavailable, clearly say so.
- Do not pretend to have live weather, market-price, or expert-directory data unless the relevant service is actually connected.

ACTION TAGS FOR AGRONEX TOOLS:
If relevant to the question, include exactly one action tag:
[ACTION:fertilizer] -> for land & fertilizer calculations
[ACTION:vet_booking] -> for livestock diseases and veterinary doctors
[ACTION:expert_booking] -> for fisheries & agronomist consultations
[ACTION:market_prices] -> for regional wholesale market rates
[ACTION:troubleshooter] -> for pest & disease troubleshooting`;

  // 4. Build Multi-Turn Content Payload
  const contents: any[] = [];

  // Sanitize and append valid recent history (up to last 6 turns)
  if (Array.isArray(history)) {
    const validHistory = history
      .filter((h: ChatHistoryItem) => h && typeof h.text === 'string' && h.text.trim().length > 0)
      .slice(-6);

    for (const msg of validHistory) {
      const sanitizedText = msg.text.trim().slice(0, 1000);
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: sanitizedText }]
      });
    }
  }

  // Current query
  contents.push({
    role: 'user',
    parts: [{ text: rawQuery }]
  });

  // 5. Initialize Official @google/genai SDK
  const ai = new GoogleGenAI({ apiKey });

  // Safe server-side diagnostic logging (NEVER LOG API KEY)
  console.log(`[AgroNex Serverless] Incoming prompt: length=${rawQuery.length}, lang=${targetLang}, historyTurns=${contents.length - 1}`);

  let lastError: any = null;
  let successfulResponse: any = null;
  let activeModelUsed = requestedModel;

  // Try candidate models in order of priority with a 25-second timeout
  for (const modelToTry of candidateModels) {
    try {
      activeModelUsed = modelToTry;
      const timeoutMs = 25000;
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), timeoutMs);
      });

      const generatePromise = ai.models.generateContent({
        model: modelToTry,
        contents,
        config: {
          systemInstruction: AGRONEX_SYSTEM_PROMPT,
          temperature: 0.6,
          maxOutputTokens: 1024
        }
      });

      successfulResponse = await Promise.race([generatePromise, timeoutPromise]);
      if (successfulResponse) break;
    } catch (err: any) {
      lastError = err;
      console.warn(`[AgroNex Serverless] Model ${modelToTry} attempt failed: ${err?.message?.slice(0, 120)}`);
      // If error is timeout or auth error, do not retry other models
      if (err?.message === 'REQUEST_TIMEOUT' || /API_KEY_INVALID|UNAUTHENTICATED/i.test(err?.message || '')) {
        break;
      }
    }
  }

  if (!successfulResponse) {
    if (lastError?.message === 'REQUEST_TIMEOUT') {
      return res.status(504).json({
        success: false,
        code: 'TIMEOUT',
        error: 'Gemini AI request timed out. Please try again.',
        isDemoMode: false
      });
    }

    const errMessage = lastError?.message || 'Gemini API call failed';
    const isAuth = /API_KEY_INVALID|UNAUTHENTICATED|permission/i.test(errMessage);
    const isQuota = /RESOURCE_EXHAUSTED|quota|rate|high demand/i.test(errMessage);

    return res.status(isAuth ? 401 : (isQuota ? 429 : 500)).json({
      success: false,
      code: isAuth ? 'INVALID_API_KEY' : (isQuota ? 'QUOTA_EXCEEDED' : 'API_ERROR'),
      error: isAuth
        ? 'Invalid GEMINI_API_KEY. Please verify your API key in Vercel settings.'
        : (isQuota ? 'Gemini API is currently experiencing high demand or quota limits. Please retry in a few moments.' : `Gemini API error: ${errMessage}`),
      isDemoMode: false
    });
  }

  const rawAnswer = successfulResponse?.text || successfulResponse?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!rawAnswer || rawAnswer.trim().length === 0) {
    return res.status(502).json({
      success: false,
      code: 'EMPTY_AI_RESPONSE',
      error: 'Gemini model returned an empty response.',
      isDemoMode: false
    });
  }

  // 6. Parse Emergency and Action Tags
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

  console.log(`[AgroNex Serverless] Success: model=${activeModelUsed}, replyLength=${cleanedText.length}, emergency=${isEmergency}`);

  // Return real live Gemini response
  return res.status(200).json({
    success: true,
    reply: cleanedText,
    isEmergency,
    actionCard,
    provider: 'Google Gemini AI',
    model: activeModelUsed,
    detectedLanguage: hasBengaliScript ? 'bn' : (banglishMarkers ? 'banglish' : 'en'),
    dominantLanguage: targetLang
  });
}
