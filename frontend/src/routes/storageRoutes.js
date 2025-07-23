const express = require('express');
const router = express.Router();
const { uploadFile } = require('../services/storage');

// Rota de upload
router.post('/upload', async (req, res) => {
  try {
    if (!req.body.file || !req.body.fileName) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const fileBuffer = Buffer.from(req.body.file, 'base64');
    const publicUrl = await uploadFile(fileBuffer, req.body.fileName);
    
    res.json({ url: publicUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;