import { ENV } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  console.error('❌ [Error Middleware]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Une erreur interne est survenue sur le serveur.';

  res.status(statusCode).json({
    success: false,
    message,
    stack: ENV.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
