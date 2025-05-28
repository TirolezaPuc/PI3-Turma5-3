// 1. Carregar variáveis de ambiente primeiro
require("dotenv").config();

// 2. Importar dependências
const path = require("path");
const admin = require("firebase-admin");

// 3. Inicializar Firebase Admin
const serviceAccount = require(path.resolve(
  __dirname,
  "./firebase-admin.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("🔥 Firebase Admin inicializado");

// 4. Importar app (Express configurado em outro arquivo)
const app = require("./src/App");

// 5. Definir porta e iniciar servidor
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
