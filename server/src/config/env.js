import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'sanaa_dev_secret_key_change_in_production_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  ADMIN_EMAIL: (process.env.ADMIN_EMAIL || 'contact@bhihi.studio').toLowerCase(),
  VDOCIPHER_API_SECRET_KEY: process.env.VDOCIPHER_API_SECRET_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
};
