// =============================================
// 1. CONFIGURAÇÕES INICIAIS E IMPORTAÇÕES
// =============================================

/**
 * Carrega variáveis de ambiente do arquivo .env
 * Exemplo: FIREBASE_PROJECT_ID, DATABASE_URL, etc.
 */
require('dotenv').config({ path: '../.env' });

/**
 * Importa as configurações validadas do arquivo config.js
 * (Contém Firebase, CORS, Rate Limit, etc.)
 */
const config = require('./config');

// Importa bibliotecas necessárias
const admin = require('firebase-admin'); // Firebase Admin SDK
const express = require('express');      // Framework para criar APIs
const cors = require('cors');           // Permite requisições de outros domínios
const helmet = require('helmet');       // Protege contra vulnerabilidades web
const compression = require('compression'); // Comprime respostas HTTP
const rateLimit = require('express-rate-limit'); // Limita requisições por IP
const multer = require('multer');       // Middleware para upload de arquivos
const path = require('path');           // Manipulação de caminhos de arquivos

// Configuração do Multer para upload de arquivos
const upload = multer({
  dest: '/tmp/uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // Limite de 10MB
});

// =============================================
// 2. INICIALIZAÇÃO DO FIREBASE (CACHE)
// =============================================

/**
 * Cache da instância do Firebase (evita múltiplas inicializações)
 */
let firebaseApp;

/**
 * Função para inicializar o Firebase (se ainda não estiver inicializado)
 * @returns {admin.app.App} Instância do Firebase
 */
const initializeFirebase = () => {
  if (firebaseApp) return firebaseApp; // Retorna se já estiver inicializado

  try {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey
      }),
      storageBucket: config.firebase.storageBucket,
      databaseURL: config.firebase.databaseUrl
    });

    console.log('✅ Firebase inicializado com sucesso');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    process.exit(1); // Encerra o servidor em caso de erro
  }
};

// =============================================
// 3. CONFIGURAÇÃO DO SERVIDOR EXPRESS
// =============================================

/**
 * Configura o servidor Express (rotas, middlewares, segurança)
 * @returns {express.Application} Aplicação Express configurada
 */
const setupServer = () => {
  const app = express();

  // ======================
  // MIDDLEWARES (INTERCEPTADORES)
  // ======================

  // 🔒 Segurança avançada com Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],       // Bloqueia scripts externos
        scriptSrc: ["'self'", "'unsafe-inline'"], // Permite JS inline
        styleSrc: ["'self'", "'unsafe-inline'"],  // Permite CSS inline
        imgSrc: ["'self'", "data:", "https://*.firebaseio.com"], // Imagens permitidas
        connectSrc: ["'self'", `https://${config.firebase.projectId}.firebaseio.com`] // Conexões permitidas
      }
    }
  }));

  // 📦 Comprime respostas HTTP (melhora performance)
  app.use(compression());

  // 📝 Configura limite de tamanho para requisições JSON
  app.use(express.json({ limit: config.maxRequestSize || '10kb' }));

  // 🌍 Configura CORS (permite requisições de outros domínios)
  app.use(cors({
    origin: config.allowedOrigins.length > 0 ? config.allowedOrigins : false,
    credentials: true, // Permite cookies/autorização
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Métodos permitidos
  }));

  // ⏱️ Rate Limiting (limita requisições por IP)
  app.use(rateLimit({
    windowMs: parseInt(config.rateWindow) * 60 * 1000 || 15 * 60 * 1000, // 15min padrão
    max: config.rateLimit || 100, // Máximo de 100 requisições por IP
    message: 'Muitas requisições deste IP. Tente novamente mais tarde.',
    standardHeaders: true, // Cabeçalhos HTTP padrão
    legacyHeaders: false   // Desativa cabeçalhos antigos
  }));

  // ======================
  // ROTAS DA API
  // ======================

  // 🔍 Rota de Health Check (verifica se o servidor está online)
  app.get('/health', (req, res) => res.json({ 
    status: 'healthy',
    environment: config.env, // Ex: "development" ou "production"
    version: '1.0.0',
    uptime: process.uptime() // Tempo de atividade em segundos
  }));

  // 👥 Rota para listar usuários (Firestore)
  app.get('/api/users', async (req, res) => {
    try {
      const snapshot = await admin.firestore().collection('users').get();
      res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Erro no Firestore:', error);
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  });

  /**
   * 🔑 Endpoint /api/auth - Valida tokens Firebase e gera tokens do backend
   * Método: POST
   * Body: { token: string } (Token JWT do Firebase)
   */
  app.post('/api/auth', async (req, res) => {
    console.log('\n🔑=== NOVA REQUISIÇÃO /api/auth ===');
    console.log('⏰ Horário:', new Date().toISOString());
    console.log('🔍 Headers (Autorização):', req.headers.authorization ? "Presente" : "Ausente");
    console.log('📦 Body (Token):', req.body.token ? "Recebido" : "Ausente");

    const { token } = req.body;

    if (!token) {
      console.log('❌ Token não enviado');
      return res.status(400).json({ error: 'Token não fornecido' });
    }

    try {
      console.log('✅ Validando token Firebase...');
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      console.log('🎉 Autenticação válida!', {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || 'não informado',
        expira_em: new Date(decodedToken.exp * 1000).toLocaleString('pt-BR')
      });

      const backendToken = "token_gerado_pelo_seu_backend";
      console.log('🔐 Token do backend gerado:', backendToken);

      res.json({
        success: true,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || null,
        },
        backendToken: backendToken
      });

    } catch (error) {
      console.error('❌ Erro na autenticação:', error.message);
      res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  });

  /**
   * 📂 Endpoint /api/files/list - Lista arquivos no Firebase Storage
   * Método: GET
   * Headers: { Authorization: "Bearer <backendToken>" }
   * Query Params: { path: string } (opcional - subdiretório)
   */
  app.get('/api/files/list', async (req, res) => {
    console.log('\n📂=== REQUISIÇÃO PARA LISTAR ARQUIVOS ===');
    
    const token = req.headers.authorization?.split('Bearer ')[1];
    const { path = '' } = req.query;

    try {
      // Valida o token JWT
      const decoded = await admin.auth().verifyIdToken(token);
      const userId = decoded.uid;

      console.log(`🔍 Listando arquivos para usuário ${userId} no caminho: ${path || 'raiz'}`);

      // Obtém referência ao bucket de storage
      const bucket = admin.storage().bucket();
      
      // Lista arquivos no caminho especificado
      const [files] = await bucket.getFiles({
        prefix: `documentos/${userId}/${path}`
      });

      // Filtra e formata os resultados
      const formattedFiles = files.map(file => {
        const fileName = path.basename(file.name);
        return {
          name: fileName,
          path: file.name,
          size: file.metadata.size,
          updated: file.metadata.updated,
          contentType: file.metadata.contentType
        };
      });

      console.log(`✅ Encontrados ${formattedFiles.length} arquivos`);
      res.json({ success: true, files: formattedFiles });

    } catch (error) {
      console.error('❌ Erro ao listar arquivos:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao listar arquivos',
        ...(config.env === 'development' && { details: error.message })
      });
    }
  });

  /**
   * ⬆️ Endpoint /api/files/upload - Faz upload de arquivos para o Firebase Storage
   * Método: POST
   * Headers: { 
   *   Authorization: "Bearer <backendToken>",
   *   Content-Type: "multipart/form-data"
   * }
   * Body: FormData com campos:
   *   - file: Arquivo a ser enviado
   *   - path: (opcional) Subdiretório de destino
   */
  app.post('/api/files/upload', upload.single('file'), async (req, res) => {
    console.log('\n⬆️=== REQUISIÇÃO DE UPLOAD ===');
    
    const token = req.headers.authorization?.split('Bearer ')[1];
    const { path = '' } = req.body;
    const file = req.file;

    if (!file) {
      console.log('❌ Nenhum arquivo enviado');
      return res.status(400).json({ success: false, error: 'Nenhum arquivo enviado' });
    }

    try {
      // Valida o token JWT
      const decoded = await admin.auth().verifyIdToken(token);
      const userId = decoded.uid;

      console.log(`📤 Recebido arquivo ${file.originalname} (${file.size} bytes) para usuário ${userId}`);

      // Define o caminho de destino no Storage
      const destination = `documentos/${userId}/${path}${path ? '/' : ''}${file.originalname}`;
      
      // Faz upload para o Firebase Storage
      await admin.storage().bucket().upload(file.path, {
        destination: destination,
        metadata: {
          contentType: file.mimetype,
          metadata: {
            uploadedBy: userId,
            originalName: file.originalname
          }
        }
      });

      console.log(`✅ Upload concluído: ${destination}`);
      res.json({ 
        success: true,
        message: 'Arquivo enviado com sucesso',
        path: destination
      });

    } catch (error) {
      console.error('❌ Erro no upload:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao enviar arquivo',
        ...(config.env === 'development' && { details: error.message })
      });
    } finally {
      // Remove o arquivo temporário após o upload
      if (file && file.path) {
        require('fs').unlinkSync(file.path);
      }
    }
  });

  /**
   * 🗑️ Endpoint /api/files/delete - Remove arquivo do Firebase Storage
   * Método: DELETE
   * Headers: { Authorization: "Bearer <backendToken>" }
   * Body: { path: string } (caminho completo do arquivo no Storage)
   */
  app.delete('/api/files/delete', async (req, res) => {
    console.log('\n🗑️=== REQUISIÇÃO PARA EXCLUIR ARQUIVO ===');
    
    const token = req.headers.authorization?.split('Bearer ')[1];
    const { path } = req.body;

    if (!path) {
      console.log('❌ Caminho do arquivo não especificado');
      return res.status(400).json({ success: false, error: 'Caminho do arquivo não especificado' });
    }

    try {
      // Valida o token JWT
      const decoded = await admin.auth().verifyIdToken(token);
      const userId = decoded.uid;

      // Verifica se o arquivo pertence ao usuário
      if (!path.startsWith(`documentos/${userId}/`)) {
        console.log('❌ Tentativa de acessar arquivo de outro usuário');
        return res.status(403).json({ success: false, error: 'Acesso não autorizado' });
      }

      console.log(`🗑️ Solicitada exclusão do arquivo: ${path}`);

      // Remove o arquivo do Storage
      await admin.storage().bucket().file(path).delete();

      console.log('✅ Arquivo excluído com sucesso');
      res.json({ success: true, message: 'Arquivo excluído com sucesso' });

    } catch (error) {
      console.error('❌ Erro ao excluir arquivo:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao excluir arquivo',
        ...(config.env === 'development' && { details: error.message })
      });
    }
  });

  // ======================
  // TRATAMENTO DE ERROS
  // ======================

  // ❌ Rota não encontrada (404)
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado' });
  });

  // 🚨 Tratamento global de erros (500)
  app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err);
    res.status(500).json({ 
      error: 'Erro interno no servidor',
      ...(config.env === 'development' && { stack: err.stack }) // Mostra stacktrace apenas em desenvolvimento
    });
  });

  return app;
};

// =============================================
// 4. INICIALIZAÇÃO E GERENCIAMENTO DO SERVIDOR
// =============================================

/**
 * Inicia o servidor e configura encerramento seguro
 */
const startServer = async () => {
  try {
    // 🔥 Inicializa Firebase
    const firebaseApp = initializeFirebase();

    // 🚀 Configura o servidor Express
    const app = setupServer();

    // ⚡ Inicia o servidor HTTP
    const server = app.listen(config.port, config.host, () => {
      console.log(`
        🚀 Backend rodando: http://${config.host}:${config.port}
        ⚙️  Modo: ${config.env}
        🔗 CORS: ${config.allowedOrigins.join(', ')}
        🔥 Firebase: ${config.firebase.projectId}
      `);
    });

    // ======================
    // ENCERRAMENTO SEGURO (GRACEFUL SHUTDOWN)
    // ======================
    const shutdownSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT']; // Sinais de desligamento
    shutdownSignals.forEach(signal => {
      process.on(signal, async () => {
        console.log(`\n🛑 Recebido ${signal}, encerrando servidor...`);

        // 1️⃣ Fecha o servidor HTTP
        server.close(async () => {
          console.log('✅ Servidor HTTP fechado');

          // 2️⃣ Encerra conexões do Firebase
          if (firebaseApp) {
            await Promise.all(
              admin.apps.map(app => app?.delete()) // Fecha todas as instâncias
            );
            console.log('✅ Conexões do Firebase encerradas');
          }

          // 3️⃣ Encerra o processo
          process.exit(0);
        });

        // ⏱️ Timeout de segurança (10 segundos)
        setTimeout(() => {
          console.error('❌ Forçando encerramento por timeout');
          process.exit(1);
        }, 10000).unref(); // Evita que o timeout impeça o encerramento
      });
    });

    return server;
  } catch (error) {
    console.error('❌ Falha na inicialização:', error);
    process.exit(1); // Encerra com erro
  }
};

// ⚡ INICIA O SERVIDOR
startServer().catch(err => {
  console.error('❌ Erro crítico:', err);
  process.exit(1);
});