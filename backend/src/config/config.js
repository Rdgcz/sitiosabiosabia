/**
 * =============================================
 * CONFIGURAÇÕES DO BACKEND (FIREBASE, CORS, etc)
 * =============================================
 * Este arquivo:
 *  - Lê variáveis de ambiente (process.env)
 *  - Carrega .env local APENAS em dev/local
 *  - Exporta tudo organizado em um objeto
 */

// Carrega variáveis do arquivo .env se estiver local (opcional)
require('dotenv').config({ path: '../.env' });

module.exports = {
  // Configuração do Firebase Admin SDK
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    /**
     * O Private Key precisa ter as quebras de linha:
     * Por isso usamos replace(/\\n/g, '\n') para funcionar no JSON.
     */
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    databaseUrl: process.env.FIREBASE_DATABASE_URL
  },

  // Domínios permitidos para CORS
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [],

  // Porta do servidor
  port: process.env.PORT || 8080,

  // Host do servidor
  host: process.env.HOST || '0.0.0.0',

  // Ambiente atual (dev ou production)
  env: process.env.NODE_ENV || 'production',

  // Rate limit (janela em minutos)
  rateWindow: process.env.RATE_WINDOW || '15',

  // Quantidade máxima de requisições por IP
  rateLimit: parseInt(process.env.RATE_LIMIT) || 100,

  // Tamanho máximo de requisição JSON
  maxRequestSize: process.env.MAX_REQUEST_SIZE || '10kb'
};
