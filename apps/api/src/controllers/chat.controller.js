import { processChatMessage, getUserThreads, getThreadDetails } from '../services/chat.service.js';

export async function chatController(req, res, next) {
  try {
    const { messages, threadId } = req.body || {};
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ error: 'User email not found in request' });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage.content) {
      return res.status(400).json({ error: 'Last message must have content' });
    }

    const result = await processChatMessage({
      userEmail,
      threadId,
      userMessage: lastMessage.content
    });

    res.json({ message: result.message, threadId: result.threadId });
  } catch (err) {
    next(err);
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
