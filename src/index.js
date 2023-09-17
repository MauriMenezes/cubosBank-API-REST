console.clear();
const express = require('express');
const app = express();
const roteador = require('./roteador.js');
const PORT = 3000;

app.use(express.json());
app.use(roteador);

app.listen(PORT, () => {
  console.log(`serv rodando na porta ${PORT}`);
});
