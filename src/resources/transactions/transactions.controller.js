const transactionModel = require("./transactions.model");
const walletModel = require("../wallet/wallet.model");
const userModel = require('../users/users.model');
const { validationResult } = require('express-validator');
const currency = require("../../Utils/moneyFormating");
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_API_KEY);


console.log(process.env.STRIPE_API_KEY);

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

const createStripeTransaction = async (paymentIntent, walletId) => {
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
  const transaction = {
    receiver: walletId,
    stripeSender: paymentMethod.card.last4,
    amount: currency.EURO(paymentIntent.amount/100).format()
  }
  transactionModel.create(transaction);
}

module.exports = {

  handleTransaction,
  getTransactionsBySender,
  getTransactionsByReceiver,
  getAllWalletTransactions,
  getBySenderLastWeek,
  getByReceiverLastWeek,
  createStripeTransaction
};