const jwt = require("jsonwebtoken");
const walletModel = require("./wallet.model");
const TransactionsModel = require("../transactions/transactions.model");
const transactionController = require("../transactions/transactions.controller");
const currency = require("../../Utils/moneyFormating");

const getOne = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );

  if (verifyWallet._id == req.params.id) {
    try {
      const wallet = await walletModel.getOne({ _id: req.params.id });
      res.status(200).json(wallet);
    } catch (error) {
      if (error.message === "wallet not found")
        return res.status(404).json({ error: "wallet not found" });
      res.status(500).json(error);
    }
  } else {
    return res
      .status(401)
      .json({ error: "User not authorized to do that action" });
  }
};

const createOne = (req, res) => {
  const newWallet = req.body;
  newWallet.funds = currency.EURO(newWallet.funds).format();
  const walletUpdated = walletModel.create(newWallet);
  res.status(201).json(walletUpdated);
};

const update = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );

  if (verifyWallet._id == req.params.id) {
    const updatedBody = {
      comment: req.body.comment,
      paymentMethod: req.body.paymentMethod,
      funds: currency.EURO(req.body.funds).format(),
    };
    const wallet = walletModel.updateOne(req.params.id, updatedBody);
    return res.status(200).json(wallet);
  } else {
    return res
      .status(401)
      .json({ error: "User not authorized to do that action" });
  }
};

const getByUserId = async (req, res) => {
  try {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    if (user._id === req.params.id) {
      const wallet = await walletModel.getByUser(req.params.id);
      return res.status(200).json(wallet);
    } else {
      return res
        .status(401)
        .json({ error: "User not authorized to do that action" });
    }
  } catch (error) {
    if (error.message === "wallet not found")
      return res.status(404).json({ error: "wallet not found" });
    res.status(500).json(error);
  }
};

const getBalance = async (req, res) => {
  try {
    const verifyWallet = await walletModel.getByUser(
      jwt.decode(req.headers.authorization.split(" ")[1])
    );
    if (verifyWallet._id == req.params.id) {
      const wallet = await walletModel.getOne({ _id: req.params.id });
      console.log("verified");
      res.status(200).json(wallet.funds);
    } else {
      return res
        .status(401)
        .json({ error: "User not authorized to do that action" });
    }
  } catch (error) {
    if (error.message === "wallet not found")
      return res.status(404).json({ error: "wallet not found" });
    res.status(500).json(error);
  }
};

const weeklyIncrement = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (verifyWallet._id == req.params.id) {
    const currentFunds = await walletModel.getOne({ _id: req.params.id });
    const outcomeTransactions = await TransactionsModel.getBySender$DateRange(
      req.params.id
    );
    const incomeTransactions = await TransactionsModel.getByReceiver$DateRange(
      req.params.id
    );
    let outcomeSum = currency.EURO(0);
    outcomeTransactions.forEach((element) => {
      outcomeSum = currency.EURO(element.amount).add(outcomeSum);
    });
    let incomeSum = currency.EURO(0);
    incomeTransactions.forEach((element) => {
      incomeSum = currency.EURO(element.amount).add(incomeSum);
    });
    let sum = currency.EURO(incomeSum).subtract(outcomeSum);
    const lastWeekFunds = currency.EURO(currentFunds.funds).subtract(sum);
    if(lastWeekFunds.value > 0) {
    let increment = (currency.EURO(sum).value * 100) / currency.EURO(lastWeekFunds).value;
    return res.status(200).json(increment.toFixed(2));
    } else {
      return res.status(200).json("-- --");
    }
  } else {
    return res
      .status(401)
      .json({ error: "User not authorized to do that action" });
  }
};

const stripePayment = async (req, res) => {
  try {
    const verifyWallet = await walletModel.getByUser(
      jwt.decode(req.headers.authorization.split(" ")[1])
    );

    if (verifyWallet._id == req.params.id) {
      const wallet = await walletModel.getOne(req.params.id);

      const updatedBody = {
        funds: currency
          .EURO(wallet.funds)
          .add(req.body.paymentIntent.amount / 100)
          .format(),
      };
      const updatedWallet = walletModel.updateOne(req.params.id, updatedBody);
      transactionController.createStripeTransaction(
        req.body.paymentIntent,
        req.params.id
      );
      return res.status(200).json(updatedWallet);
    }
  } catch (err) {
    console.log(err);
  }
};
const walletHistogram = async (req, res) => {
  try {
    const verifyWallet = await walletModel.getByUser(
      jwt.decode(req.headers.authorization.split(" ")[1])
    );
    if (!(verifyWallet._id == req.params.id))
      return res.status(401).json("Unauthorized");
    const currentFunds = await walletModel.getOne({ _id: req.params.id });
    const outcomeTransactions = await TransactionsModel.getBySender$DateRange(
      req.params.id
    );
    const incomeTransactions = await TransactionsModel.getByReceiver$DateRange(
      req.params.id
    );
    outcomeTransactions.map((e) => {
      const amountValue = currency.EURO(e.amount).value;
      e.amount = currency.EURO(-amountValue).format();
    });

    let allTransactions = incomeTransactions.concat(outcomeTransactions);
    allTransactions.sort((a, b) => {
      var c = new Date(a.date);
      var d = new Date(b.date);
      return d - c;
    });
    let countingMoney = {
      funds: currentFunds.funds,
      date: new Date(),
    };
    const walletMoney = [
      {
        funds: currency.EURO(currentFunds.funds).value,
        date: countingMoney.date.getDay(),
      },
    ];

    allTransactions.forEach((transaction) => {
      if (transaction.date.getDay() === countingMoney.date.getDay()) {
        countingMoney.funds = currency
          .EURO(countingMoney.funds)
          .subtract(transaction.amount)
          .format();
      } else {
        countingMoney.date.setDate(countingMoney.date.getDate() - 1);
        walletMoney.push({
          funds: currency.EURO(countingMoney.funds).value,
          date: countingMoney.date.getDay(),
        });
        countingMoney.funds = currency
          .EURO(countingMoney.funds)
          .subtract(transaction.amount)
          .format();
      }
    });
    while (walletMoney.length < 7) {
      countingMoney.date.setDate(countingMoney.date.getDate() - 1);
      walletMoney.push({
        funds: currency.EURO(countingMoney.funds).value,
        date: countingMoney.date.getDay(),
      });
    }
    return res.status(200).json(walletMoney);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getOne,
  createOne,
  update,
  getByUserId,
  getBalance,
  weeklyIncrement,
  stripePayment,
  walletHistogram,
};
