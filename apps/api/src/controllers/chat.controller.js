import { processChatMessage, getUserThreads, getThreadDetails, deleteThread } from '../services/chat.service.js';

export async function chatController(req, res, next) {
  try {
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

    // Process chat processing with the backend services

    const result = await processChatMessage({
      userEmail,
      threadId,
      userMessage
    });

    res.json({ message: result.message, threadId: result.threadId });
  } catch (err) {
    console.error('FULL BACKEND ERROR:', err);
    let status = err?.status || 500;

    if (status === 503 || err?.message?.includes('503') || err?.message?.includes('high demand')) {
      status = 503;
      return res.status(status).json({
        success: false,
        error: 'The AI model is currently busy due to high demand. Please try again shortly.',
        details: null
      });
    }

    if (status === 429 || err?.message?.includes('429') || err?.message?.includes('quota')) {
      status = 429;
      return res.status(status).json({
        success: false,
        error: 'AI Model quota exceeded. Please wait a minute before sending more messages.',
        details: null
      });
    }

    res.status(status).json({
      success: false,
      error: err?.message || 'An internal error occurred while processing your request',
      details: process.env.NODE_ENV === 'production' ? null : { name: err?.name, message: err?.message }
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

export async function deleteThreadController(req, res, next) {
  try {
    const { threadId } = req.params;
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ error: 'User email not found in request' });
    }

    if (!threadId) {
      return res.status(400).json({ error: 'threadId is required' });
    }

    await deleteThread(userEmail, threadId);
    res.json({ success: true, message: 'Thread deleted successfully' });
  } catch (err) {
    next(err);
  }
}
