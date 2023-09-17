const express = require('express');
const roteador = express();
const {
  listarConta,
  criarConta,
  atualizaConta,
  removerConta,
  depostiar,
  sacar,
  transferir,
  saldo,
  extrato,
} = require('./controller/bancoController.js');

roteador.get('/contas', listarConta);
roteador.post('/contas', criarConta);
roteador.put('/contas/:numeroConta/usuario', atualizaConta);
roteador.delete('/contas/:numeroConta', removerConta);
roteador.post('/transacoes/depositar', depostiar);
roteador.post('/transacoes/sacar', sacar);
roteador.post('/transacoes/transferir', transferir);
roteador.get('/contas/saldo', saldo);
roteador.get('/contas/extrato', extrato);

module.exports = roteador;
