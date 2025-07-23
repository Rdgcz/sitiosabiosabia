require('dotenv').config();

// =============================================
// CONFIGURAÇÃO PRINCIPAL
// =============================================
const config = {
  // Core
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 8080,
  host: process.env.HOST || '0.0.0.0',
  instanceName: process.env.INSTANCE_NAME || 'sss-backend',
  logLevel: process.env.LOG_LEVEL || 'info',
  enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
  apiBaseUrl: process.env.API_BASE_URL,
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()) || [],

  // Security
  jwtSecret: process.env.JWT_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || '1h',
  corsOrigins: process.env.CORS_ORIGINS?.split(',').map(s => s.trim()) || [],
  rateLimit: parseInt(process.env.RATE_LIMIT) || 1000,
  rateWindow: process.env.RATE_WINDOW || '15m',
  csrfEnabled: process.env.CSRF_ENABLED === 'true',
  helmetConfig: tryParseJSON(process.env.HELMET_CONFIG) || {
    hidePoweredBy: true,
    noSniff: true,
    frameguard: { action: 'deny' }
  },

  // Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    databaseUrl: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  },

  // Database (caso use PostgreSQL/MySQL)
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    poolSize: parseInt(process.env.DB_POOL_SIZE) || 20,
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 3000,
    queryTimeout: parseInt(process.env.QUERY_TIMEOUT) || 5000
  },

  // Performance
  maxRequestSize: process.env.MAX_REQUEST_SIZE || '1mb',
  responseTimeout: parseInt(process.env.RESPONSE_TIMEOUT) || 30000,
  keepAliveTimeout: parseInt(process.env.KEEP_ALIVE_TIMEOUT) || 5000
};

// =============================================
// VALIDAÇÕES
// =============================================

// Helper para parse de JSON seguro
function tryParseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

// Variáveis obrigatórias
const requiredVars = [
  'API_BASE_URL',
  'JWT_SECRET',
  'SESSION_SECRET',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
];

// Validação das variáveis
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`❌ Variável de ambiente obrigatória faltando: ${varName}`);
  }
});

// Validações específicas
if (config.firebase.privateKey && !config.firebase.privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
  throw new Error('❌ Formato inválido da FIREBASE_PRIVATE_KEY');
}

if (config.env === 'production' && config.allowedOrigins.length === 0) {
  console.warn('⚠️  ALLOWED_ORIGINS vazio em produção - isso pode causar problemas de CORS');
}

// =============================================
// EXPORTAÇÃO
// =============================================
module.exports = config;