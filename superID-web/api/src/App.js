const express = require("express");
const cors = require("cors"); // Middleware para CORS

// Inicializa app Express
const app = express();

// Middlewares básicos
app.use(cors()); // Habilita CORS para todas rotas
app.use(express.json()); // Configura parser de JSON

// arquivo de configs das rotas
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/qr", require("./routes/qr.route"));

module.exports = app; // Exporta app configurado
