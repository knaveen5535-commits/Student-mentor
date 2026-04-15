import { countProjects, createProject, getSearchHistory, searchProjects } from '../services/project.service.js';

export async function createProjectController(req, res, next) {
  try {
    const { title, information } = req.body || {};
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }
    const project = await createProject({
      userEmail: req.user.email,
      title: title.trim(),
      information: (information || '').trim()
    });
    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
}

export async function listProjectsController(req, res, next) {
  try {
    const q = String(req.query.q || '');
    const projects = await searchProjects({ userEmail: req.user.email, query: q });
    res.json({ projects });
  } catch (err) {
    next(err);
  }
}

export async function historyController(req, res, next) {
  try {
    const history = await getSearchHistory({ userEmail: req.user.email });
    res.json({ history });
  } catch (err) {
    next(err);
  }
}

export async function projectCountController(req, res, next) {
  try {
    const count = await countProjects({ userEmail: req.user.email });
    res.json({ count });
  } catch (err) {
    next(err);
  }
}
