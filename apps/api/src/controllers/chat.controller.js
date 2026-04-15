import { generateChatCompletion } from '../services/ai.service.js';

export async function chatController(req, res, next) {
  try {
    const { messages } = req.body || {};
    const assistantMessage = await generateChatCompletion({ messages });
    res.json({ message: assistantMessage });
  } catch (err) {
    next(err);
  }
}
