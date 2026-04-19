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

  try {
    const ai = getClient();
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: filtered,
      config: {
        systemInstruction: systemText,
      }
    });

    return { role: 'assistant', content: response.text };
  } catch (err) {
    console.error('AI Service: Google generateChatCompletion error:', err);
    throw err;
  }
}
