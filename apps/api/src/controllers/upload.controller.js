import multer from 'multer';
import path from 'node:path';
import { ensureUploadDir, uploadDir } from '../services/file.service.js';

ensureUploadDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeBase = path.basename(file.originalname).replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${safeBase}`);
  }
});

export const uploadMiddleware = multer({ storage });

export async function uploadController(req, res, next) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'file is required' });

    res.status(201).json({
      file: {
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`
      }
    });
  } catch (err) {
    next(err);
  }
}
