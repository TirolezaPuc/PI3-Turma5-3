const express = require("express");
const app = express();

app.use(express.json());

app.post("/api/test", (req, res) => {
  console.log("Requisição recebida em /api/test");
  res.json({ status: "funcionando" });
});

app.listen(5000, () => {
  console.log("Rodando em http://localhost:5000");
});
