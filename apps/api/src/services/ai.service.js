import { OpenRouter } from '@openrouter/ai';

const MODEL_NAME = 'meta-llama/llama-2-7b-chat'; // Popular OpenRouter model
let cachedClient = null;

function getApiKey() {
  const apiKey = (process.env.OPENROUTER_API_KEY || '').trim();
  if (!apiKey) {
    const err = new Error('OPENROUTER_API_KEY is missing');
    err.status = 500;
    console.error('AI Service: OPENROUTER_API_KEY is missing');
    throw err;
  }
  console.log('AI Service: OPENROUTER_API_KEY is set (length:', apiKey.length + ')');
  return apiKey;
}

function getClient() {
  if (!cachedClient) {
    cachedClient = new OpenRouter({ apiKey: getApiKey() });
  }
  return cachedClient;
}

function extractContent(result) {
  if (!result) {
    const err = new Error('No response object from OpenRouter');
    err.status = 502;
    console.error('AI Service: extractContent - No result:', result);
    throw err;
  }
  
  const content = result?.choices?.[0]?.message?.content;
  const cleanText = typeof content === 'string' ? content.trim() : '';
  
  if (!cleanText) {
    const err = new Error('Empty response from OpenRouter');
    err.status = 502;
    console.error('AI Service: extractContent - Empty content:', {
      hasChoices: !!result?.choices,
      choicesLength: result?.choices?.length,
      message: result?.choices?.[0]?.message,
      content
    });
    throw err;
  }
  return cleanText;
}

export async function generateResponse(prompt) {
  const text = typeof prompt === 'string' ? prompt.trim() : '';
  if (!text) {
    const err = new Error('message is required');
    err.status = 400;
    throw err;
  }

  try {
    console.log('AI Service: Prompt received:', { length: text.length, preview: text.substring(0, 100) });
    const client = getClient();
    console.log('AI Service: Creating OpenRouter request with model:', MODEL_NAME);
    
    const result = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [{ role: 'user', content: text }]
    });

    const output = extractContent(result);
    console.log('AI Service: OpenRouter response received:', { length: output.length, model: MODEL_NAME, preview: output.substring(0, 100) });
    return output;
  } catch (err) {
    console.error('AI Service: OpenRouter generateResponse error:', {
      message: err?.message,
      status: err?.status,
      name: err?.name,
      stack: err?.stack
    });
    throw err;
  }
}

export async function generateChatCompletion({ messages } = {}) {
  const normalized = Array.isArray(messages) ? messages : [];
  const payload = normalized
    .map((message) => ({
      role: message?.role === 'assistant' ? 'assistant' : 'user',
      content: String(message?.content || '')
    }))
    .filter((entry) => entry.content.trim().length > 0);

  if (payload.length === 0) {
    const err = new Error('messages are required');
    err.status = 400;
    throw err;
  }

  try {
    console.log('AI Service: Chat completion request with', payload.length, 'messages');
    const client = getClient();
    const result = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: payload
    });

    const output = extractContent(result);
    console.log('AI Service: OpenRouter chat response received:', { length: output.length, model: MODEL_NAME, preview: output.substring(0, 100) });
    return { role: 'assistant', content: output };
  } catch (err) {
    console.error('AI Service: OpenRouter generateChatCompletion error:', {
      message: err?.message,
      status: err?.status,
      name: err?.name,
      stack: err?.stack
    });
    throw err;
  }
}
