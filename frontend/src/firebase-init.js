const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// =============================================
// 1. CONFIGURAÇÃO DINÂMICA PARA AMBIENTES
// =============================================
let serviceAccount;

if (process.env.NODE_ENV === 'production') {
  serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') .replace(/^['"]|['"]$/g, '')
  };
} else {
  try {
    serviceAccount = require(path.resolve(__dirname, '..', process.env.FIREBASE_CREDENTIALS_PATH));
  } catch (error) {
    console.error('❌ Erro ao carregar credenciais:', error.message);
    process.exit(1);
  }
}

// =============================================
// 2. INICIALIZAÇÃO SEGURA
// =============================================
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    console.log('✅ Firebase Admin inicializado com sucesso');
  } catch (error) {
    console.error('❌ Falha na inicialização:', error.message);
    process.exit(1);
  }
}

// =============================================
// 3. TESTE DE CONEXÃO SIMPLIFICADO (OPCIONAL)
// =============================================
// Teste genérico que não depende de usuário específico
admin.auth().listUsers(1)
  .then(() => console.log('🔑 Teste de conexão bem-sucedido'))
  .catch(err => console.log('⚠️ Aviso: Teste de conexão:', err.message));

module.exports = admin; // Exporta o objeto admin diretamente