import { GoogleGenAI } from '@google/genai';

const MODEL_NAME = 'gemini-2.5-flash';
let cachedClient = null;

function getApiKey() {
  const apiKey = (process.env.GOOGLE_API_KEY || '').trim();
  if (!apiKey) {
    const err = new Error('GOOGLE_API_KEY is missing');
    err.status = 500;
    console.error('AI Service: GOOGLE_API_KEY is missing');
    throw err;
  }
  return apiKey;
}

function getClient() {
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey: getApiKey() });
  }
  return cachedClient;
}

export async function generateResponse(prompt) {
  const text = typeof prompt === 'string' ? prompt.trim() : '';
  if (!text) {
    const err = new Error('message is required');
    err.status = 400;
    throw err;
  }

  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: text,
      config: {
        systemInstruction: "You are AI Mentor, a highly advanced assistant.",
      }
    });
    return response.text;
  } catch (err) {
    console.error('AI Service: Google generateResponse error:', err);
    throw err;
  }
}

export async function generateChatCompletion({ messages } = {}) {
  const normalized = Array.isArray(messages) ? messages : [];

  if (normalized.length === 0) {
    const err = new Error('messages are required');
    err.status = 400;
    throw err;
  }

  // Gemini expects strict 'user'/'model' alternating history and 'user' at the very beginning (usually).
  // Strict System Prompt logic
  let systemText = `You are AI Mentor, a highly advanced educational assistant.
CRITICAL RULES:
1. You MUST ONLY answer questions related to Science, Technology, Physics, Mathematics, and Education.
2. If the user asks about ANYTHING else (e.g. movies, cooking, sports, general chatter), you MUST politely refuse to answer and concisely remind them of your educational domain.
3. You can analyze images, documents, and code natively. Provide insightful, structured answers.`;

  const filtered = [];

  for (const m of normalized) {
    const content = String(m.content || '').trim();
    if (!content) continue;
    if (m.role === 'system') {
      systemText = content;
      continue;
    }

    // Convert 'assistant' back to 'model'
    let geminiRole = m.role === 'assistant' ? 'model' : 'user';

    // Parse possible multimodal block
    let parts = [];
    try {
      const parsed = JSON.parse(content);
      if (parsed.text !== undefined || parsed.attachments) {
        if (parsed.text) parts.push({ text: parsed.text });
        if (Array.isArray(parsed.attachments)) {
          parsed.attachments.forEach(att => {
            parts.push({
              inlineData: { data: att.data, mimeType: att.mimeType }
            });
          });
        }
      } else {
        parts.push({ text: content });
      }
    } catch {
      // Normal plain string
      parts.push({ text: content });
    }

    // To handle consecutive same roles (which Gemini rejects), try merging texts
    if (filtered.length > 0 && filtered[filtered.length - 1].role === geminiRole) {
      // Just push new parts into the existing role block
      filtered[filtered.length - 1].parts.push(...parts);
    } else {
      filtered.push({
        role: geminiRole,
        parts: parts
      });
    }
  }

  // Gemini must start with 'user'
  if (filtered.length > 0 && filtered[0].role === 'model') {
    filtered.shift();
  }

  if (filtered.length === 0) {
    throw new Error('No valid user messages found');
  }

  const delays = [2000, 4000, 8000];
  let attempt = 0;
  let finalErr = null;

  const ai = getClient();

  while (attempt <= delays.length) {
    try {
      // Fallback model on the last retry attempt if still failing
      const currentModel = attempt === delays.length ? 'gemini-1.5-flash' : MODEL_NAME;

      const response = await ai.models.generateContent({
        model: currentModel,
        contents: filtered,
        config: {
          systemInstruction: systemText,
        }
      });

      return { role: 'assistant', content: response.text };
    } catch (err) {
      finalErr = err;
      const is503 = err?.status === 503 || (err?.message && err.message.includes('503'));
      const is429 = err?.status === 429 || (err?.message && err.message.includes('429')) || (err?.message && err.message.includes('quota'));

      if (is503 && attempt < delays.length) {
        console.warn(`AI Service: 503 High Demand. Retrying in ${delays[attempt]}ms (Attempt ${attempt + 1} of ${delays.length})...`);
        await new Promise(resolve => setTimeout(resolve, delays[attempt]));
        attempt++;
      } else {
        break; // Stop retrying if not 503, if 429, or out of retries
      }
    }
  }

  console.error('AI Service: Google generateChatCompletion error:', finalErr);

  // Format a cleaned API error
  const is503Final = finalErr?.status === 503 || finalErr?.message?.includes('503');
  const is429Final = finalErr?.status === 429 || finalErr?.message?.includes('429') || finalErr?.message?.includes('quota');

  let cleanMessage = finalErr?.message || 'Failed to generate content';
  if (is503Final) cleanMessage = 'AI Model is currently experiencing high demand. Please try again later.';
  if (is429Final) cleanMessage = 'AI Model quota exceeded. Please wait a minute before trying again.';

  const cleanError = new Error(cleanMessage);
  cleanError.status = is503Final ? 503 : (is429Final ? 429 : (finalErr?.status || 500));
  throw cleanError;
}

export async function explain3DConcept(concept) {
  try {
    const ai = getClient();
    const prompt = `You are a 3D Interactive Learning AI. Explain the concept of "${concept}" for a class 8-12 student. 
Break it into parts. You MUST return ONLY valid JSON in the exact following structure without markdown blocks (ensure keys are strictly double quoted):
{
  "title": "String title",
  "steps": ["Step 1 string", "Step 2 string"],
  "parts": [
    { "name": "PartName1", "explanation": "Explanation 1" }
  ]
}`;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text);
  } catch (err) {
    console.error('AI Service: explain3DConcept Error:', err);
    throw new Error('Failed to generate 3D concept explanation');
  }
}
