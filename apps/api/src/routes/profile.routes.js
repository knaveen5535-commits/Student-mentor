import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { profileController } from '../controllers/profile.controller.js';

export const profileRoutes = Router();

profileRoutes.get('/', requireAuth, profileController);
