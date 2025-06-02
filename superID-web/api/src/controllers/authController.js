const admin = require("firebase-admin");
const db = admin.firestore();

// Handler para login SIMULADO
exports.login = (req, res) => {
  const { email, password } = req.body; // recebe credenciais do form
  console.log("[Login] Requisição recebida:", { email });

  // Validação básica de campos obrigatórios
  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha obrigatórios." });
  }

  const token = "test-token-123"; // Token fixo (por enquanto mock)

  return res.json({
    success: true,
    token, // Token mock para uso em requisições autenticadas
    email, // Retorna o email para feedback visual
  });
};

// Handler SIMULADO para recuperação de senha
exports.forgotPassword = (req, res) => {
  const { email } = req.body; // recebe email para recuperação de conta
  console.log("[Recuperação] Requisição recebida:", { email });

  if (!email) {
    return res.status(400).json({ message: "Email obrigatório." });
  }

  console.log("[Recuperação] Instruções enviadas (simulado).");

  // Simula envio de e-mail com token de recuperação
  return res.json({
    success: true,
    message: `Instruções enviadas para ${email}.`, // Mensagem de confirmação (apenas mock)
  });
};

const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

const axios = require("axios"); // Única dependência necessária

const PERFORM_AUTH_URL = "https://getloginstatus-ey3isjsbgq-uc.a.run.app/";

const performAuth = async (req, res) => {
  const { apiKey, siteUrl } = req.body;

  if (!apiKey || !siteUrl) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    const { data } = await axios.post(PERFORM_AUTH_URL, {
      apiKey,
      domain: siteUrl,
    });

    return res.json({
      loginToken: data.loginToken,
      qrBase64: data.qrCode.split(",")[1],
    });
  } catch (error) {
    console.error("Erro:", error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || "Falha ao gerar QR Code";
    return res.status(status).json({ error: message });
  }
};

exports.performAuth = performAuth;
