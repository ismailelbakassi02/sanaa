import { OAuth2Client } from 'google-auth-library';
import { ENV } from '../config/env.js';

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

export const verifyGoogleIdToken = async (idToken) => {
  // Mode de développement ou simulation de test
  if (!ENV.GOOGLE_CLIENT_ID || ENV.GOOGLE_CLIENT_ID.startsWith('mock_')) {
    console.log('ℹ️ [Google Auth]: Mode de simulation locale actif.');
    return {
      googleId: 'mock_google_id_10928374',
      email: 'etudiant.demo@gmail.com',
      name: 'Amine Kadiri (Demo)',
      picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: ENV.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    console.error('❌ Erreur de vérification du Token Google:', error.message);
    throw new Error('Échec de la validation du token Google OAuth.');
  }
};
