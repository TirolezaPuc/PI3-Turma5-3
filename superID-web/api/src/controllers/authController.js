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

exports.performAuth = async (req, res) => {
  const { apiKey, siteUrl } = req.body;
  console.log("[QR Auth] Requisição recebida:", { apiKey, siteUrl });

  if (!apiKey || !siteUrl) {
    console.warn("[QR Auth] apiKey ou siteUrl ausente.");
    return res.status(400).json({ error: "Parâmetros obrigatórios ausentes." });
  }

  // validação simples
  if (apiKey !== process.env.TEST_API_KEY) {
    console.warn("[QR Auth] API Key inválida.");
    return res.status(403).json({ error: "API Key inválida." });
  }

  const loginToken = uuidv4().replace(/-/g, "") + uuidv4().replace(/-/g, ""); // ~256 caracteres
  console.log("[QR Auth] Token gerado:", loginToken);

  // tenta gerar imagem QR Code com esse conteúdo
  try {
    // Cria documento no Firestore na coleção 'login'
    await db.collection("partners").doc(loginToken).set({
      apiKey,
      siteUrl,
      createdAt: new Date(),
      loginToken,
    });
    console.log("[QR Auth] Documento criado no Firestore com sucesso.");

    const qrBase64 = await QRCode.toDataURL(loginToken);
    console.log("[QR Auth] QR Code gerado com sucesso.");

    return res.json({ loginToken, qrBase64: qrBase64.split(",")[1] }); // envia apenas o base64 puro
  } catch (err) {
    console.error(
      "[QR Auth] Erro ao gerar QR Code ou salvar no Firestore:",
      err
    );
    return res.status(500).json({ error: "Erro ao gerar QR Code." });
  }
};
