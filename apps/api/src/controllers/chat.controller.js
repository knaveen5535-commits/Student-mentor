import { processChatMessage, getUserThreads, getThreadDetails } from '../services/chat.service.js';

export async function chatController(req, res, next) {
  try {
    console.log('Chat request body:', req.body);
    const { messages, threadId, message } = req.body || {};
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ error: 'User email not found in request' });
    }

    let userMessage = '';

    if (typeof message === 'string' && message.trim()) {
      userMessage = message.trim();
    } else if (Array.isArray(messages) && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.content) {
        userMessage = String(lastMessage.content).trim();
      }
    }

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Incoming message:', userMessage);

    const result = await processChatMessage({
      userEmail,
      threadId,
      userMessage
    });

    res.json({ message: result.message, threadId: result.threadId });
  } catch (err) {
    console.error('FULL BACKEND ERROR:', err);
    const status = err?.status || 500;
    res.status(status).json({
      error: err?.message || 'Unknown error',
      details: {
        name: err?.name,
        message: err?.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack
      }
    });
  }
}

export async function getThreadsController(req, res, next) {
  try {
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ error: 'User email not found in request' });
    }

    const threads = await getUserThreads(userEmail);
    res.json({ threads });
  } catch (err) {
    next(err);
  }
}

export async function getThreadDetailsController(req, res, next) {
  try {
    const { threadId } = req.params;
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ error: 'User email not found in request' });
    }

    if (!threadId) {
      return res.status(400).json({ error: 'threadId is required' });
    }

    const thread = await getThreadDetails(userEmail, threadId);
    res.json({ thread });
  } catch (err) {
    next(err);
  }
}
