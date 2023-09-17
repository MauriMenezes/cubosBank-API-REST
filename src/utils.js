const { v4: uuidv4 } = require('uuid');
const data = require('./bancodedados.js');

const { format } = require('date-fns');

function geraId() {
  const uuid = uuidv4();
  return uuid.replace(/\D/g, '');
}

function verificaConta(numConta) {
  return data.contas.find((el) => {
    return el.numero == numConta;
  });
}
function verificaCpf(cpf) {
  return data.contas.find((el) => {
    return el.usuario.cpf == cpf;
  });
}

function verificaSenha(senha, numero_conta) {
  const conta = data.contas.find((el) => {
    return el.numero == numero_conta;
  });

  if (senha == conta.usuario.senha) {
    console.log('1');
    return true;
  }
  return false;
}

function dataFormatada() {
  const dataFormatada = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  return dataFormatada;
}

module.exports = {
  geraId,
  verificaConta,
  verificaSenha,
  dataFormatada,
  verificaCpf,
};
