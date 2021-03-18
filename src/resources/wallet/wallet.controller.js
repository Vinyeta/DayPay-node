const walletModel = require('./wallet.model');
const TransactionsModel = require('../transactions/transactions.model');
const transactionController = require('../transactions/transactions.controller')
const currency = require("../../Utils/moneyFormating");



const getOne = async (req, res) => {
  try {
    const wallet = await walletModel.getOne({ _id: req.params.id });
    res.status(200).json(wallet);
  } catch (error) {
    if (error.message === "wallet not found") return res.status(404).json({ error: "wallet not found" });
    res.status(500).json(error);
  }
}

const createOne = (req, res) => {
  const newWallet = req.body;
  newWallet.funds = currency.EURO(newWallet.funds).format();
  const walletUpdated = walletModel.create(newWallet)
  res.status(201).json(walletUpdated)
};

const update = (req, res) => {
  const updatedBody = {
    "comment" : req.body.comment,
    "paymentMethod": req.body.paymentMethod,
    "funds": currency.EURO(req.body.funds).format()
  }
  const wallet = walletModel.updateOne(req.params.id, updatedBody);
  return res.status(200).json(wallet);
};

const getByUserId = async (req, res) => {
  try {
    const wallet = await walletModel.getByUser(req.params.id);
    res.status(200).json(wallet);
  } catch (error) {
    if (error.message === "wallet not found") return res.status(404).json({ error: "wallet not found" });
    res.status(500).json(error);
  }
}

const getBalance = async (req, res) => {
  try {
    const wallet = await walletModel.getOne({ _id: req.params.id });
    res.status(200).json(wallet.funds);
  } catch (error) {
    if (error.message === "wallet not found") return res.status(404).json({ error: "wallet not found" });
    res.status(500).json(error);
  }
}

const weeklyIncrement = async (req, res) => {
  const currentFunds = await walletModel.getOne({ _id: req.params.id });
  const outcomeTransactions = await TransactionsModel.getBySender$DateRange(req.params.id)
  const incomeTransactions = await TransactionsModel.getByReceiver$DateRange(req.params.id)
  let outcomeSum = currency.EURO(0);
  outcomeTransactions.forEach(element => {
    outcomeSum = currency.EURO(element.amount).add(outcomeSum);
  });
  let incomeSum = currency.EURO(0);
  incomeTransactions.forEach(element => {
    incomeSum = currency.EURO(element.amount).add(incomeSum);
  });
  let sum = currency.EURO(incomeSum).subtract(outcomeSum);
  const lastWeekFunds = currency.EURO(currentFunds.funds).subtract(sum);
  let increment = currency.EURO(sum).value * 100 / currency.EURO(lastWeekFunds).value
  return res.status(200).json(increment);
}

const stripePayment = async (req,res) => {
  try {
    const wallet = await walletModel.getOne(req.params.id);

    const updatedBody = {
      "funds": currency.EURO(wallet.funds).add(req.body.paymentIntent.amount/100).format()
    }
    console.log(updatedBody.funds); 
    const updatedWallet = walletModel.updateOne(req.params.id, updatedBody);
    transactionController.createStripeTransaction(req.body.paymentIntent, req.params.id)
    return res.status(200).json(updatedWallet);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getOne,
  createOne,
  update,
  getByUserId,
  getBalance,
  weeklyIncrement,
  stripePayment
};
