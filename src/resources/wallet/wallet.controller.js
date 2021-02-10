const walletModel = require('./wallet.model');
const TransactionsModel = require('../transactions/transactions.model');

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
  const walletUpdated = walletModel.create(newWallet)
  res.status(201).json(walletUpdated)
};

const updateOne = (req, res) => {
  const wallet = walletModel.updateOne(req.params.id, req.body);
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
  console.log(currentFunds)
  let outcomeSum = 0;
  outcomeTransactions.forEach(element => {
    outcomeSum += element.amount
  });
  let incomeSum = 0;
  incomeTransactions.forEach(element => {
    incomeSum += element.amount
  });
  let sum = incomeSum - outcomeSum;
  console.log(sum)
  const lastWeekFunds = currentFunds.funds - sum;

  const increment = sum * 100 / lastWeekFunds;
  return res.status(200).json(increment);
}
module.exports = {
  getOne,
  createOne,
  updateOne,
  getByUserId,
  getBalance,
  weeklyIncrement
};
