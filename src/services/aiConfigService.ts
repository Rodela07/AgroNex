// AgroNex Bangladesh - AI Configuration & Provider Service
// Manages LLM Provider settings, API Keys, and response preferences securely.

export type AiProviderType = 'demo' | 'gemini' | 'openai' | 'groq' | 'openrouter';
export type AiResponseLanguagePref = 'auto' | 'bn' | 'en';

export interface AiConfig {
  provider: AiProviderType;
  apiKey: string;
  model: string;
  responseLanguage: AiResponseLanguagePref;
  temperature: number;
}

const STORAGE_KEY_CONFIG = 'agronex_ai_config';

export const DEFAULT_AI_CONFIG: AiConfig = {
  provider: 'demo',
  apiKey: '',
  model: 'gemini-1.5-flash',
  responseLanguage: 'auto',
  temperature: 0.6
};

export const PROVIDER_MODELS: Record<AiProviderType, { id: string; name: string }[]> = {
  demo: [
    { id: 'offline-expert-engine', name: 'AgroNex Offline Expert Engine (ডেমো)' }
  ],
  gemini: [
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (দ্রুত ও নিখরচায় রিকমেন্ডেড)' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (উন্নত বিশ্লেষণ)' }
  ],
  openai: [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini (দ্রুত ও সাশ্রয়ী)' },
    { id: 'gpt-4o', name: 'GPT-4o (হাই পারফরম্যান্স)' }
  ],
  groq: [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (আল্ট্রা ফাস্ট)' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' }
  ],
  openrouter: [
    { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5 (OpenRouter)' },
    { id: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 8B' }
  ]
};

/**
 * Loads AI configuration from browser localStorage.
 */
export function getAiConfig(): AiConfig {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return { ...DEFAULT_AI_CONFIG };
    }
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw) return { ...DEFAULT_AI_CONFIG };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_AI_CONFIG,
      ...parsed
    };
  } catch (err) {
    return { ...DEFAULT_AI_CONFIG };
  }
}

/**
 * Saves AI configuration to browser localStorage.
 */
export function saveAiConfig(config: Partial<AiConfig>): AiConfig {
  const current = getAiConfig();
  const updated: AiConfig = {
    ...current,
    ...config
  };
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
    }
  } catch (err) {
    console.error('Failed to save AI config to localStorage:', err);
  }
  return updated;
}

/**
 * Resets AI configuration to default demo mode.
 */
export function resetAiConfig(): AiConfig {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_CONFIG);
    }
  } catch (err) {
    console.error('Failed to reset AI config:', err);
  }
  return { ...DEFAULT_AI_CONFIG };
}

/**
 * Security disclaimer for frontend prototype.
 */
export const AI_SECURITY_NOTICE = {
  bn: `⚠️ নিরাপত্তা সতর্কতা (ক্লায়েন্ট-সাইড প্রোটোটাইপ):
এগ্রোনেক্স বর্তমানে একটি ব্রাউজার-ভিত্তিক প্রোটোটাইপ। আপনি এখানে যে API Key প্রদান করবেন তা কেবল আপনার বর্তমান ব্রাউজারের LocalStorage-এ সংরক্ষিত থাকে এবং ব্রাউজার থেকে সরাসরি সংশ্লিষ্ট এআই প্রোভাইডারের অফিসিয়াল HTTPS এন্ডপয়েন্টে পাঠানো হয়। কোনো তৃতীয় পক্ষের সার্ভারে এটি সংরক্ষণ করা হয় না।
বাস্তব প্রোডাকশন সিস্টেমে সকল এআই রিকোয়েস্ট একটি সুরক্ষিত ব্যাকএন্ড সার্ভারের মাধ্যমে পরিচালনা করা উচিত।`,
  en: `⚠️ Security Notice (Client-Side Prototype):
AgroNex is currently running as a client-side frontend prototype. Any API key entered here is stored exclusively in your local browser LocalStorage and dispatched directly to the official AI provider endpoint over encrypted HTTPS. No third-party server intercepts or stores your key.
For live production deployments with public users, always proxy AI API calls through an authenticated backend server.`
};
