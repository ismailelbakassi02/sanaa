import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { ENV } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- 1. Middlewares de Sécurité & Utilitaires ---
app.use(helmet({ crossOriginResourcePolicy: false })); // Permet l'affichage des images de reçus
app.use(
  cors({
    origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. Servir les uploads de reçus en statique sécurisé ---
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- 3. Route de Santé (Health Check) ---
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'SANAA (صَنْعة) API',
    version: '1.0.0',
    mode: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// --- 4. Montage des Routes REST ---
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/admin', adminRoutes);

// --- 5. Gestion des Routes 404 Non Trouvées ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Le point d’entrée ${req.method} ${req.originalUrl} n’existe pas sur l’API SANAA.`,
  });
});

// --- 6. Middleware Centralisé de Gestion des Erreurs ---
app.use(errorHandler);

// --- 7. Démarrage du Serveur ---
app.listen(ENV.PORT, () => {
  console.log(`
  ======================================================
  🎬 SANAA (صَنْعة) API Server démarré avec succès !
  📡 URL: http://localhost:${ENV.PORT}
  🌍 Client autorisé: ${ENV.CLIENT_URL}
  🛡️ Protection DRM: Active
  👤 Admin par défaut: ${ENV.ADMIN_EMAIL}
  ======================================================
  `);
});
