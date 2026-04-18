import { Router } from 'express';
import { aiChatController } from '../controllers/ai.controller.js';

export const aiRoutes = Router();

aiRoutes.post('/chat', aiChatController);
