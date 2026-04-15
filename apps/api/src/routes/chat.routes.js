import { Router } from 'express';
import { chatController } from '../controllers/chat.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const chatRoutes = Router();

chatRoutes.post('/', requireAuth, chatController);
