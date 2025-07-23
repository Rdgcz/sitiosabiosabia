const admin = require('firebase-admin');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bucket = admin.storage().bucket();

// =============================================
// CONSTANTES DE CONFIGURAÇÃO
// =============================================
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'text/plain'
];

// =============================================
// FUNÇÃO PRINCIPAL DE UPLOAD
// =============================================
/**
 * Realiza upload seguro de arquivos para o Firebase Storage
 * @param {Buffer} fileBuffer - Conteúdo binário do arquivo
 * @param {String} fileName - Nome original do arquivo
 * @param {String} [contentType='auto'] - Tipo MIME (opcional)
 * @returns {Promise<{url: string, metadata: object}>} 
 * @throws {Error} Erros de validação ou upload
 */
const uploadFile = async (fileBuffer, fileName, contentType = 'auto') => {
  try {
    // 1. VALIDAÇÕES INICIAIS
    if (!Buffer.isBuffer(fileBuffer)) {
      throw new Error('O arquivo deve ser um Buffer');
    }

    if (fileBuffer.length > MAX_FILE_SIZE) {
      throw new Error(`Tamanho máximo excedido (${MAX_FILE_SIZE/1024/1024}MB)`);
    }

    // 2. PREPARAÇÃO DO ARQUIVO
    const fileExt = path.extname(fileName).toLowerCase();
    const sanitizedName = path.basename(fileName, fileExt)
      .replace(/[^\w.-]/g, '_')
      .substring(0, 50);
    
    const finalFileName = `uploads/${uuidv4()}_${sanitizedName}${fileExt}`;
    const file = bucket.file(finalFileName);

    // 3. METADADOS CUSTOMIZADOS
    const metadata = {
      contentType: contentType !== 'auto' ? contentType : getMimeType(fileExt),
      metadata: {
        originalName: fileName,
        uploadedAt: new Date().toISOString(),
        sizeBytes: fileBuffer.length,
        uploadId: uuidv4()
      }
    };

    // 4. VALIDAÇÃO DE TIPO (opcional)
    if (process.env.NODE_ENV === 'production' && 
        !ALLOWED_MIME_TYPES.includes(metadata.contentType)) {
      throw new Error('Tipo de arquivo não permitido');
    }

    // 5. UPLOAD EFETIVO
    await file.save(fileBuffer, { metadata });
    await file.makePublic();

    // 6. GERAÇÃO DA URL SEGURA
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2025' // 1 ano de validade
    });

    return {
      url: signedUrl,
      metadata: {
        fileName: finalFileName,
        contentType: metadata.contentType,
        ...metadata.metadata
      }
    };

  } catch (error) {
    console.error('❌ Erro no Firebase Storage:', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    throw new Error(`Falha no upload: ${error.message}`);
  }
};

// =============================================
// FUNÇÕES AUXILIARES
// =============================================
/**
 * Infer MIME type from file extension
 */
function getMimeType(ext) {
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain'
  };
  return types[ext] || 'application/octet-stream';
}

module.exports = {
  uploadFile,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES
};