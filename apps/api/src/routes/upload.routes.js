import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { uploadController, uploadMiddleware } from '../controllers/upload.controller.js';

export const uploadRoutes = Router();

uploadRoutes.post('/', requireAuth, uploadMiddleware.single('file'), uploadController);
