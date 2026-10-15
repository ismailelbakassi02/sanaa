import { db } from '../services/db.js';
import { generatePlaybackCredentials } from '../services/vdoCipherService.js';

export const getCourses = (req, res) => {
  const isStudentActive = req.user && (req.user.status === 'active' || req.user.role === 'admin');
  const rawCourses = db.getCourses();

  // Filtrage des métadonnées pour sécuriser les flux
  const courses = rawCourses.map((course) => ({
    ...course,
    modules: course.modules.map((mod) => ({
      ...mod,
      videos: mod.videos.map((vid) => ({
        id: vid.id,
        title: vid.title,
        description: vid.description,
        durationSeconds: vid.durationSeconds,
        isFreePreview: vid.isFreePreview,
        isLocked: !isStudentActive && !vid.isFreePreview,
        resourcesPdfUrl: isStudentActive ? vid.resourcesPdfUrl : null,
      })),
    })),
  }));

  res.status(200).json({
    success: true,
    courses,
    isStudentActive,
  });
};

export const getVideoPlayback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = db.findVideoById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo introuvable dans le catalogue.',
      });
    }

    const isAuthorized = req.user.role === 'admin' || req.user.status === 'active' || video.isFreePreview;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'Vous devez avoir un abonnement actif pour visionner ce cours protégé.',
      });
    }

    // Récupération de l'adresse IP du client
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '105.158.20.12';

    // Génération du jeton DRM et des paramètres du filigrane dynamique
    const credentials = await generatePlaybackCredentials(video.drmVideoId, req.user, clientIp);

    res.status(200).json({
      success: true,
      video: {
        id: video.id,
        title: video.title,
        description: video.description,
        durationSeconds: video.durationSeconds,
        resourcesPdfUrl: video.resourcesPdfUrl,
      },
      drm: credentials,
    });
  } catch (error) {
    next(error);
  }
};
