console.log("🔁 ROTA /api/auth carregada"); // Log de inicialização

// Dependências
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rotas públicas
router.post("/login", authController.login);
router.post("/forgot", authController.forgotPassword);

module.exports = router; // Exporta router configurado
