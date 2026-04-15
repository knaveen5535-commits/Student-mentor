import { env } from '../config/env.js';

export async function generateChatCompletion({ messages }) {
  if (!env.openrouterApiKey) {
    return {
      role: 'assistant',
      content: 'OPENROUTER_API_KEY is not set on the backend. Add it to apps/api/.env to enable real responses.'
    };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.openrouterApiKey}`,
        'HTTP-Referer': env.apiUrl,
        'X-Title': 'AI Mentor'
      },
      body: JSON.stringify({
        model: env.openrouterModel,
        messages: messages || [],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      let errorMessage = `OpenRouter API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        const text = await response.text();
        console.error('OpenRouter API response:', text);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'No response from AI';

    return { role: 'assistant', content };
  } catch (err) {
    console.error('Chat completion error:', err);
    throw err;
  }
}
