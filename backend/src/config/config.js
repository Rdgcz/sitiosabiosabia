require('dotenv').config({ path: '../.env' }); // Só funciona local

module.exports = {
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    databaseUrl: process.env.FIREBASE_DATABASE_URL
  },
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [],
  port: process.env.PORT || 8080,
  host: process.env.HOST || '0.0.0.0',
  env: process.env.NODE_ENV || 'production',
  rateWindow: process.env.RATE_WINDOW || '15',
  rateLimit: parseInt(process.env.RATE_LIMIT) || 100,
  maxRequestSize: process.env.MAX_REQUEST_SIZE || '10kb'
};
