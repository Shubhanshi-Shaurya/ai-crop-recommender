
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const translateText = async (text, targetLangISO) => {
  if (!targetLangISO || targetLangISO === 'en-IN') return text;

  try {
    const response = await fetch(`${BASE_URL}/api/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        target_lang: targetLangISO
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.translated_text || text;
    }
  } catch (error) {
    console.warn(" Local translation proxy timeout. Falling back to default text.");
  }
  return text;
};