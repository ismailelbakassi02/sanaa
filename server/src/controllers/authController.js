import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { db } from '../services/db.js';
import { verifyGoogleIdToken } from '../services/googleAuthService.js';

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Le token Google (idToken) est requis.',
      });
    }

    // 1. Validation cryptographique du token Google
    const googleUser = await verifyGoogleIdToken(idToken);

    // 2. Recherche ou création du compte dans la base
    let user = db.findUserByGoogleId(googleUser.googleId) || db.findUserByEmail(googleUser.email);

    if (!user) {
      const isInitialAdmin = googleUser.email.toLowerCase() === ENV.ADMIN_EMAIL;
      user = db.createUser({
        googleId: googleUser.googleId,
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.picture,
        role: isInitialAdmin ? 'admin' : 'student',
        status: isInitialAdmin ? 'active' : 'lead', // Les nouveaux sont des leads jusqu'à souscription
      });
      console.log(`✨ [Nouveau Lead Capturé via Google]: ${user.name} (${user.email})`);
    } else {
      // Mise à jour de l'avatar et du nom au cas où ils ont changé sur Google
      user = db.updateUser(user.id, {
        name: googleUser.name,
        avatarUrl: googleUser.picture,
        lastLoginAt: new Date().toISOString(),
      });
    }

    // 3. Signature du token de session JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        phoneWhatsapp: user.phoneWhatsapp,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl,
      phoneWhatsapp: req.user.phoneWhatsapp,
      role: req.user.role,
      status: req.user.status,
    },
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { phoneWhatsapp } = req.body;
    const updated = db.updateUser(req.user.id, { phoneWhatsapp });
    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès.',
      user: updated,
    });
  } catch (error) {
    next(error);
  }
};
