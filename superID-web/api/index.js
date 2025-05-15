const app = require("./src/App");
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
