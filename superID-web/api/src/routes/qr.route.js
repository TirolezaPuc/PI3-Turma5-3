// config rota de QR code
const express = require("express");
const router = express.Router();
const qrController = require("../controllers/qrController");

// Rota pública para geração de QR Code
router.get("/generate", qrController.generateQR);

module.exports = router; // Exporta o router configurado
