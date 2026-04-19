import { Router } from 'express';
import { chatController, getThreadsController, getThreadDetailsController, deleteThreadController } from '../controllers/chat.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const chatRoutes = Router();

// POST: Send a message to a thread (sends message and gets AI response)
chatRoutes.post('/', requireAuth, chatController);

// GET: Get all threads for the current user
chatRoutes.get('/threads', requireAuth, getThreadsController);

// GET: Get a specific thread with all its messages
chatRoutes.get('/threads/:threadId', requireAuth, getThreadDetailsController);

// DELETE: Delete a specific thread
chatRoutes.delete('/threads/:threadId', requireAuth, deleteThreadController);

