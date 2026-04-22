import { Router } from 'express';
import { 
  createSessionController, 
  logInteractionController, 
  explainConceptController 
} from '../controllers/3d.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const threeRoutes = Router();

threeRoutes.post('/session', requireAuth, createSessionController);
threeRoutes.post('/interaction', requireAuth, logInteractionController);
threeRoutes.post('/explain', requireAuth, explainConceptController);
