const transactionModel = require("./transactions.model");
const walletModel = require("../wallet/wallet.model");

const e = require("cors");

const getAll = async (req, res) => {
  const transaction = await transactionModel.all();

  return res.status(200).json(transaction);
};

const getOne = async (req, res) => {
  const transaction = await transactionModel.get(req.params.id);
  if (transaction) {
    return res.status(200).json(transaction);
  }
  return res.status(404).end();
};

const create = (req, res) => {
  const newTransaction = req.body;
  const transactionCreated = transactionModel.create(newTransaction);

  return res.status(201).json(transactionCreated);
};

const update = (req, res) => {
  const updateTransaction = req.body;

  const transactionUpdated = transactionModel.update(
    req.params.id,
    updateTransaction
  );

  return res.status(200).json(transactionUpdated);
};

const remove = (req, res) => {
  const transactionWithoutTheDeleted = transactionModel.remove(req.params.id);

  return res.status(200).json(transactionWithoutTheDeleted);
};

const handleTransaction = async (req, res) => {
  const newTransaction = req.body;
  const sender = await walletModel.getOne(req.body.sender);
  const receiver = await walletModel.getOne(req.body.receiver);
  const hola = req.params.id; //aqui obtenemos el params para no repetir el getOne req.body.receiver
  console.log(hola);

  const moneyToAddOrSubstract = req.body.amount; //validar primero si la wallet tiene el dinero que pretende enviar.
  if (sender.saldo > moneyToAddOrSubstract) {
    const walletSuma = await walletModel.updateOne(receiver, {
      saldo: receiver.saldo + moneyToAddOrSubstract,
    });

    const walletResta = await walletModel.updateOne(sender, {
      saldo: sender.saldo - moneyToAddOrSubstract,
    });
    const transactionCreated = transactionModel.create(newTransaction);

    return res
      .status(200)
      .json({ transactionCreated, walletSuma, walletResta });
  } else {
    return res.status(400).json("error: Dinero insuficiente para ser enviado");
  }
};

const getTransactionsBySender = async (req, res) => {
  const outgoingTransactions = await transactionModel.getBySender(
    req.params.id
  );
  return res.status(200).json(outgoingTransactions);
};

const getTransactionsByReceiver = async (req, res) => {
  const incomingTransactions = await transactionModel.getByReceiver(
    req.params.id
  );
  return res.status(200).json(incomingTransactions);
};

const getAllWalletTransactions = async (req, res) => {
  const incomingTransactions = await transactionModel.getByReceiver(
    req.params.id
  );
  const outgoingTransactions = await transactionModel.getBySender(
    req.params.id
  );
  return res.status(200).json({ incomingTransactions, outgoingTransactions });
};
module.exports = {
  create,
  update,
  getAll,
  getOne,
  remove,
  handleTransaction,
  getTransactionsBySender,
  getTransactionsByReceiver,
  getAllWalletTransactions,
};
