import { createSession, logInteraction } from '../services/three.service.js';
import { explain3DConcept } from '../services/ai.service.js';

export async function createSessionController(req, res, next) {
  try {
    const { topic } = req.body;
    const userId = req.user?.id;
    if (!topic || !topic.trim()) return res.status(400).json({ error: 'Topic is required' });

    const session = await createSession(userId, topic.trim());
    res.status(201).json({ session });
  } catch (err) { next(err); }
}

export async function logInteractionController(req, res, next) {
  try {
    const { sessionId, objectClicked } = req.body;
    const userId = req.user?.id;

    if (!sessionId || !objectClicked) {
      return res.status(400).json({ error: 'sessionId and objectClicked are required' });
    }

    const interaction = await logInteraction(sessionId, userId, objectClicked);
    res.status(201).json({ interaction });
  } catch (err) { next(err); }
}

export async function explainConceptController(req, res, next) {
  try {
    const { concept } = req.body;
    if (!concept || !concept.trim()) {
      return res.status(400).json({ error: 'Concept is required' });
    }

    const explanation = await explain3DConcept(concept.trim());
    res.json({ explanation });
  } catch (err) { next(err); }
}
