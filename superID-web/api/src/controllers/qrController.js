// Gera QR code básico (versão de teste)
exports.generateQR = (req, res) => {
  const token = "test-token-qr"; // Token estático para desenvolvimento
  res.json({ qrToken: token }); // Retorna token de teste
};
