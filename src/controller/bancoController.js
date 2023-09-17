const data = require('../bancodedados.js');
const {
  geraId,
  verificaConta,
  verificaSenha,
  dataFormatada,
} = require('../utils.js');

const listarConta = (req, res) => {
  const { senha_banco } = req.query;

  senha_banco == data.banco.senha
    ? res.status(200).json(data.contas)
    : res.status(400).json({ message: 'senha incorreta' });
};
const atualizaConta = (req, res) => {
  const { numeroConta } = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  const conta = verificaConta(numeroConta);
  const cpfExistente = data.contas.find((el) => {
    return el.usuario.cpf == cpf && el.numero != numeroConta;
  });
  const emailExistente = data.contas.find((el) => {
    return el.usuario.email == email && el.numero != numeroConta;
  });
  if (!conta) {
    return res.status(400).json({ messagem: 'conta não existe' });
  }
  if (cpfExistente) {
    return res
      .status(400)
      .json({ mensagem: 'O CPF informado já existe cadastrado!'`` });
  }
  if (emailExistente) {
    return res
      .status(400)
      .json({ mensagem: 'O email informado já existe cadastrado!'`` });
  }

  conta.usuario.nome = nome;
  conta.usuario.cpf = cpf;
  conta.usuario.data_nascimento = data_nascimento;
  conta.usuario.telefone = telefone;
  conta.usuario.email = email;
  conta.usuario.senha = senha;

  return res.status(204).end();
};
const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res.status(400).json({ message: 'preencha todos os campos' });
  }

  const cpfExistente = data.contas.find((el) => {
    return el.usuario.cpf == cpf;
  });

  const emailExistente = data.contas.find((el) => {
    return el.usuario.email == email;
  });

  if (emailExistente || cpfExistente) {
    return res.status(400).json({
      mensagem: 'O CPF ou Email informados já existem',
    });
  }
  data.contas.push({
    numero: geraId(),
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  });
  return res.status(201).end();
};

const removerConta = (req, res) => {
  const { numeroConta } = req.params;
  const conta = verificaConta(numeroConta);

  if (!conta) {
    return res.status(404).json({ message: 'Número da conta não existe' });
  }
  data.contas = data.contas.filter((el) => {
    return el.numero != numeroConta;
  });

  res.status(200).end();
};

const depostiar = (req, res) => {
  const { numero_conta, valor } = req.body;

  if (valor <= 0) {
    return res
      .status(400)
      .json({ mensagem: 'valor não pode ser menor/igual a zero' });
  }

  const conta = verificaConta(numero_conta);

  if (!conta) {
    return res.status(404).json({
      mensagem: 'Conta bancária não encontada!',
    });
  }
  conta.saldo += valor;
  data.depositos.push({ data: dataFormatada(), numero_conta, valor });
  return res.status(204).end();
};

const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body;

  const conta = verificaConta(numero_conta);
  const senhaValida = verificaSenha(senha, numero_conta);
  if (!conta) {
    return res.status(404).json({ mensagem: 'A conta não existe' });
  }
  if (!senhaValida) {
    return res
      .status(404)
      .json({ mensagem: 'A senha do conta esta incorreta' });
  }
  if (conta.saldo < valor) {
    return res
      .status(400)
      .json({ message: 'saldo menor que o valor de saque' });
  }
  if (valor <= 0) {
    return res
      .status(400)
      .json({ message: 'O valor não pode ser menor ou igual a 0' });
  }
  conta.saldo -= valor;

  data.saques.push({
    data: new Date(),
    numero_conta,
    valor,
  });
  return res.status(200).end();
};

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
  const contaOrigem = verificaConta(numero_conta_origem);
  const contaDestino = verificaConta(numero_conta_destino);
  const senhaConta = verificaSenha(senha, numero_conta_origem);

  if (!contaOrigem) {
    return res.status(400).json({ message: 'Conta de Origem não existe' });
  }
  if (!contaDestino) {
    return res.status(400).json({ message: 'Conta de destino não existe' });
  }
  if (!senhaConta) {
    return res.status(400).json({ message: 'Senha incorreta' });
  }
  if (valor <= 0) {
    return res
      .status(400)
      .json({ mensagem: 'valor não pode ser menor/igual a zero' });
  }
  if (valor > contaOrigem.saldo) {
    return res.status(400).json({ mensagem: 'Saldo insuficiente!' });
  }
  contaOrigem.saldo -= valor;
  contaDestino.saldo += valor;
  data.transferencias.push({
    data: dataFormatada(),
    numero_conta_origem,
    numero_conta_destino,
    valor,
  });
  res.status(200).end();
};
const saldo = (req, res) => {
  const { numero_conta, senha } = req.query;

  const conta = verificaConta(numero_conta);
  const senhaCorreta = verificaSenha(senha, numero_conta);
  if (!conta) {
    return res.status(400).json({ mensagem: 'numero da conta incorreto' });
  }
  if (!senhaCorreta) {
    return res.status(400).json({ mensagem: 'senha incorreta' });
  }

  res.status(200).json({ saldo: conta.saldo });
};
const extrato = (req, res) => {
  const { numero_conta, senha } = req.query;

  const conta = verificaConta(numero_conta);
  const senhaConta = verificaSenha(senha, numero_conta);

  if (!conta) {
    return res.status(400).json({ message: 'conta não existe' });
  }
  if (!senhaConta) {
    return res.status(400).json({ mensagem: 'senha incorreta' });
  }

  const saque = data.saques.filter((el) => {
    return el.numero_conta == numero_conta;
  });
  const deposito = data.depositos.filter((el) => {
    return el.numero_conta == numero_conta;
  });
  const transferencias = data.transferencias.filter((el) => {
    return el.numero_conta == numero_conta;
  });

  res.status(200).json({ saque, deposito, transferencias });
};
module.exports = {
  criarConta,
  listarConta,
  removerConta,
  depostiar,
  sacar,
  transferir,
  atualizaConta,
  saldo,
  extrato,
};
