import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { db } from '../services/db.js';

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès refusé. Token d’authentification manquant.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    const user = db.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable ou session expirée.',
      });
    }

    if (user.status === 'banned') {
      return res.status(403).json({
        success: false,
        message: 'Ce compte a été suspendu pour des raisons de sécurité.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou session expirée.',
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé exclusivement aux administrateurs de SANAA.',
    });
  }
  next();
};

export const requireActiveStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentification requise.' });
  }

  if (req.user.role === 'admin') {
    return next(); // L'administrateur a toujours accès
  }

  if (req.user.status !== 'active') {
    return res.status(403).json({
      success: false,
      code: 'SUBSCRIPTION_REQUIRED',
      status: req.user.status,
      message: 'Vous devez avoir un abonnement actif pour visionner ce contenu protégé.',
    });
  }

  next();
};
