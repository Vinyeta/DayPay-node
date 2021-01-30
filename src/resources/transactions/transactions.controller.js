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
  const sender = await walletModel.getOne(req.body.sender);
  const receiver = await walletModel.getOne(req.body.receiver);

  const moneyToAddOrSubstract = req.body.amount;

  const walletSuma = await walletModel.updateOne(receiver, {
    saldo: receiver.saldo + moneyToAddOrSubstract,
  });

  const walletResta = await walletModel.updateOne(sender, {
    saldo: sender.saldo - moneyToAddOrSubstract,
  });

  return res.status(200).json({ walletSuma, walletResta }); //Con ID 601461321445540d541ecf05 funciona perfectamente. pero si uso el ID 601461411445540d541ecf06 No suma al primer iD pero si resta al que envia.
};

module.exports = {
  create,
  update,
  getAll,
  getOne,
  remove,
  handleTransaction,
};
