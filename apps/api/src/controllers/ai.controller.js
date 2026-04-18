import { generateResponse } from '../services/ai.service.js';

export async function aiChatController(req, res) {
  try {
    console.log('AI chat request received:', {
      hasBody: !!req.body,
      messageType: typeof req.body?.message,
      body: req.body
    });

    const { message } = req.body || {};
    const userMessage = typeof message === 'string' ? message.trim() : '';

    if (!userMessage) {
      console.warn('AI chat validation failed: message is required');
      return res.status(400).json({ success: false, message: 'message is required' });
    }

    console.log('AI chat message length:', { length: userMessage.length, message: userMessage.substring(0, 100) });

    const response = await generateResponse(userMessage);
    console.log('AI chat response ready:', { length: response.length, preview: response.substring(0, 100) });

    return res.json({ success: true, data: response });
  } catch (err) {
    console.error('BACKEND ERROR AI CHAT:', {
      message: err?.message,
      status: err?.status,
      stack: err?.stack,
      name: err?.name
    });
    const status = err?.status || 500;
    return res.status(status).json({
      success: false,
      message: err?.message || 'Internal Server Error',
      error: err?.message || 'Internal Server Error'
    });
  }
}
