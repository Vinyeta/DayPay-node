const transactionModel = require("./transactions.model");
const walletModel = require("../wallet/wallet.model");
const userModel = require('../users/users.model');
const { validationResult } = require('express-validator');
const currency = require("../../Utils/moneyFormating");
const parseDate = require('../../Utils/parseDate')


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
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.amount < 0 ) {
        return res.status(400).json("Invalid value");
      }
  const sender = await walletModel.getOne(req.body.sender);
  const targetUser = await  userModel.getByEmail(req.body.receiver);
  const receiver = await walletModel.getByUser(targetUser._id)

  if (req.body.sender == receiver._id) return res.status(400).json('Cannot send money to yourself')

  const newTransaction = {
    "sender": req.body.sender,
    "receiver": receiver._id,
    "amount": currency.EURO(req.body.amount).format()
  };
  const moneyToAddOrSubstract = currency.EURO(req.body.amount); //validar primero si la wallet tiene el dinero que pretende enviar.
  if (currency.EURO(sender.funds).value >= currency.EURO(moneyToAddOrSubstract).value) {
    const walletSuma = await walletModel.updateOne(receiver, {
      funds: currency.EURO(receiver.funds).add(moneyToAddOrSubstract).format(),
    });
    const walletResta = await walletModel.updateOne(sender, {
      funds: currency.EURO(sender.funds).subtract(moneyToAddOrSubstract).format(),
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
  outgoingTransactions.map((e) =>{
    const amountValue = currency.EURO(e.amount).value;
    e.amount = currency.EURO(-amountValue).format();
  }); 
  outgoingTransactions.slice(0,10);
  return res.status(200).json(outgoingTransactions);
};

const getTransactionsByReceiver = async (req, res) => {
  const incomingTransactions = await transactionModel.getByReceiver(
    req.params.id
  );
  incomingTransactions.slice(0,10);
  return res.status(200).json(incomingTransactions);
};

const getAllWalletTransactions = async (req, res) => {
  const incomingTransactions = await transactionModel.getByReceiver(
    req.params.id
  );
  const outgoingTransactions = await transactionModel.getBySender(
    req.params.id
  );
  outgoingTransactions.map((e) =>{
    const amountValue = currency.EURO(e.amount).value;
    e.amount = currency.EURO(-amountValue).format();
  }); 


  let allTransactions = incomingTransactions.concat(outgoingTransactions);
  allTransactions.sort((a, b) => {
    var c = new Date(a.date);
    var d = new Date(b.date);
    return d-c;
  });

  allTransactions = allTransactions.slice(0,10);
 
  return res.status(200).json(allTransactions);
};
const getBySenderLastWeek = async (req, res) => {
  try {
    const outgoingTransactions = await transactionModel.getBySender$DateRange(req.params.id);
    return res.status(200).json(outgoingTransactions);
  } catch (error) {
    console.log(error);
  }
}
const getByReceiverLastWeek = async (req, res) => {
  try {
    const ingoingTransactions = await transactionModel.getByReceiver$DateRange(req.params.id);
    return res.status(200).json(ingoingTransactions);
  } catch (error) {
    console.log(error);
  }
}

const getByReceiverSenderLastWeek = async (req, res) => {
  const incomingTransactions = await transactionModel.getByReceiver$DateRange(req.params.id);
  const outgoingTransactions = await transactionModel.getBySender$DateRange(req.params.id);
  outgoingTransactions.map((e) =>{
    const amountValue = currency.EURO(e.amount).value;
    e.amount = currency.EURO(-amountValue).format();
  }); 


  let allTransactions = incomingTransactions.concat(outgoingTransactions);
  allTransactions.sort((a, b) => {
    var c = new Date(a.date);
    var d = new Date(b.date);
    return d-c;
  }); 
  allTransactions.map((e)=> e.date = parseDate(e.date));
  return res.status(200).json(allTransactions); 
}

module.exports = {
  update,
  getAll,
  getOne,
  remove,
  handleTransaction,
  getTransactionsBySender,
  getTransactionsByReceiver,
  getAllWalletTransactions,
  getBySenderLastWeek,
  getByReceiverLastWeek,
  getByReceiverSenderLastWeek
};