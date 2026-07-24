const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import { supabase } from '../supabaseClient';

/**
 * Provides language translation metadata matrices dynamically
 */
export const fetchSupportedLanguages = async () => {
  return [
    { code: 'en-IN', name: 'English' },
    { code: 'hi-IN', name: 'हिन्दी (Hindi)' },
    { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'te-IN', name: 'తెలుగు (Telugu)' },
    { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
    { code: 'mr-IN', name: 'मराठी (Marathi)' },
    { code: 'bn-IN', name: 'বাংলা (Bengali)' }
  ];
};

/**
 * fetching credentials from supabase and sending to database
 */

export const recommendCrops = async (formData) => {
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Get active session token and user info from Supabase
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const user = session?.user;

  const payload = {
    ...formData,
    user_id: user?.id,
    user_email: user?.email
  };

  const response = await fetch(`${BACKEND_URL}/api/recommend-crops`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to calculate recommendations');
  }

  return await response.json();
};

/**
 * Deep recursive object parsing translation loop
 */
export const translateContent = async (sourceData, targetLang) => {
  if (!sourceData || !targetLang || targetLang === 'en-IN') return sourceData;

  // Type String
  if (typeof sourceData === 'string') {
    if (!isNaN(sourceData)) return sourceData;
    try {
      const response = await fetch(`${BACKEND_URL}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceData, target_lang: targetLang })
      });
      if (response.ok) {
        const data = await response.json();
        return data.translated_text || sourceData;
      }
    } catch (e) {
      console.warn("Translation loop bypass for: ", sourceData);
    }
    return sourceData;
  }

  // Type Array
  if (Array.isArray(sourceData)) {
    return await Promise.all(sourceData.map(item => translateContent(item, targetLang)));
  }

  // Type Object
  if (typeof sourceData === 'object') {
    const translatedObj = { ...sourceData };
    const promises = Object.keys(translatedObj).map(async (key) => {
      // Exclude metric integers to avoid rendering corruption
      if (['status', 'latitude', 'longitude', 'predicted_yield_tons_per_acre', 'estimated_profit_inr', 'sustainability_score'].includes(key)) {
        return;
      }
      translatedObj[key] = await translateContent(translatedObj[key], targetLang);
    });
    await Promise.all(promises);
    return translatedObj;
  }

  return sourceData;
};

/**
 * Submits analytical input arrays directly to the Python server backend
 */
export const executeOptimization = async (payload) => {
  const response = await fetch(`${BACKEND_URL}/api/recommend-crops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Backend server mapping exception caught.");
  return await response.json();
};