import { Router } from 'express';
import {
  createProjectController,
  historyController,
  listProjectsController,
  projectCountController
} from '../controllers/project.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const projectRoutes = Router();

projectRoutes.get('/', requireAuth, listProjectsController);
projectRoutes.post('/', requireAuth, createProjectController);
projectRoutes.get('/history', requireAuth, historyController);
projectRoutes.get('/count', requireAuth, projectCountController);
