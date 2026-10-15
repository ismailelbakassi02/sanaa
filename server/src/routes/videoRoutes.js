import express from 'express';
import { getCourses, getVideoPlayback } from '../controllers/videoController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Permet de voir le catalogue des cours
router.get('/courses', getCourses);

// Visionner une vidéo protégée sous DRM
router.get('/:id/playback', requireAuth, getVideoPlayback);

export default router;
