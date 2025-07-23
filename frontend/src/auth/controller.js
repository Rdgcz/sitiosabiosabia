const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const admin = require('firebase-admin');
const { authenticate } = require('./middleware');

const router = express.Router();

// =============================================
// Configuração do Firebase Auth
// =============================================

// Inicialize o Firebase Admin SDK (adicione ao seu startup.js)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../firebase-service-account.json')),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

// =============================================
// Rotas de Autenticação
// =============================================

/**
 * @api {post} /auth/login Login com Firebase
 * @apiDescription Autentica usuário via Firebase Auth
 */
router.post('/login', rateLimit({ windowMs: 15*60*1000, max: 5 }), async (req, res) => {
  try {
    const { error } = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    }).validate(req.body);

    if (error) return res.status(400).json({ error: error.details });

    // Autenticação com Firebase
    const { email, password } = req.body;
    const userRecord = await admin.auth().getUserByEmail(email);

    // Gera token JWT personalizado
    const token = jwt.sign(
      {
        uid: userRecord.uid,
        email: userRecord.email,
        role: userRecord.customClaims?.role || 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName
      }
    });

  } catch (error) {
    console.error('Firebase Auth Error:', error);
    
    // Tratamento específico para erros do Firebase
    if (error.code === 'auth/user-not-found') {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    res.status(500).json({ error: 'Erro na autenticação' });
  }
});

/**
 * @api {get} /auth/me Dados do usuário
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.user.uid);
    res.json({
      uid: user.uid,
      email: user.email,
      name: user.displayName
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

module.exports = router;