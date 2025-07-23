const express = require('express');
const router = express.Router();
const { uploadFile } = require('../services/storage');
const admin = require('firebase-admin');
const Joi = require('@hapi/joi');

// =============================================
// VALIDAÇÕES
// =============================================
const uploadSchema = Joi.object({
  file: Joi.string().base64().required().messages({
    'string.base64': 'Formato Base64 inválido',
    'any.required': 'Campo "file" é obrigatório'
  }),
  fileName: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Nome do arquivo muito curto (mín. 3 caracteres)',
    'string.max': 'Nome do arquivo muito longo (máx. 100 caracteres)',
    'any.required': 'Campo "fileName" é obrigatório'
  })
});

// =============================================
// ROTAS
// =============================================
router.post('/upload', async (req, res) => {
  // Log simplificado
  console.log(`📤 Upload solicitado por ${req.ip} | Tamanho: ${req.headers['content-length']} bytes`);

  try {
    // Validação com Joi
    const { error, value } = uploadSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    const { file, fileName } = value;

    // Processamento do upload
    const fileBuffer = Buffer.from(file, 'base64');
    const url = await uploadFile(fileBuffer, fileName, req.headers['content-type']);

    // Resposta de sucesso
    return res.json({
      success: true,
      url,
      metadata: {
        fileName,
        size: fileBuffer.length,
        type: req.headers['content-type'] || 'auto'
      }
    });

  } catch (error) {
    console.error('❌ Falha no upload:', {
      error: error.message,
      stack: error.stack.split('\n')[0] // Apenas primeira linha do stack
    });

    const statusCode = error.message.includes('Firebase') ? 502 : 500;
    
    return res.status(statusCode).json({
      error: 'Falha no processamento',
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.message 
      })
    });
  }
});

router.get('/status', async (req, res) => {
  try {
    await admin.storage().bucket().getMetadata();
    res.json({ 
      status: 'OK',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'OFFLINE',
      error: 'Serviço de armazenamento indisponível' 
    });
  }
});

module.exports = router;