// Handler para login SIMULADO
exports.login = (req, res) => {
  const { email, password } = req.body; // recebe credenciais do form

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

  if (!email) {
    return res.status(400).json({ message: "Email obrigatório." });
  }

  // Simula envio de e-mail com token de recuperação
  return res.json({
    success: true,
    message: `Instruções enviadas para ${email}.`, // Mensagem de confirmação (apenas mock)
  });
};
