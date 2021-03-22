const transactionModel = require("./transactions.model");
const walletModel = require("../wallet/wallet.model");
const userModel = require("../users/users.model");
const currency = require("../../Utils/moneyFormating");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const handleTransaction = async (payload) => {
  payload = JSON.parse(payload);
  if (payload.amount < 0) {
    return "Amount not a postive number";
  }
  const sender = await walletModel.getOne(payload.sender);
  const targetUser = await userModel.getByEmail(payload.receiver);
  const receiver = await walletModel.getByUser(targetUser._id);

  if (payload.sender == receiver._id) return "Cannot send money to yourself";

  const newTransaction = {
    sender: payload.sender,
    receiver: receiver._id,
    amount: currency.EURO(payload.amount).format(),
  };
  const moneyToAddOrSubstract = currency.EURO(payload.amount); //validar primero si la wallet tiene el dinero que pretende enviar.
  if (
    currency.EURO(sender.funds).value >=
    currency.EURO(moneyToAddOrSubstract).value
  ) {
    await walletModel.updateOne(receiver, {
      funds: currency.EURO(receiver.funds).add(moneyToAddOrSubstract).format(),
    });
    await walletModel.updateOne(sender, {
      funds: currency
        .EURO(sender.funds)
        .subtract(moneyToAddOrSubstract)
        .format(),
    });
    transactionModel.create(newTransaction);
  }
};

const getTransactionsBySender = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (verifyWallet._id == req.params.id) {
    const outgoingTransactions = await transactionModel.getBySender(
      req.params.id
    );
    outgoingTransactions.map((e) => {
      const amountValue = currency.EURO(e.amount).value;
      e.amount = currency.EURO(-amountValue).format();
    });
    outgoingTransactions.slice(0, 10);
    return res.status(200).json(outgoingTransactions);
  } else {
    return res
      .status(401)
      .json({ error: "User not authorized to do that action" });
  }
};

const getTransactionsByReceiver = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (verifyWallet._id == req.params.id) {
    const incomingTransactions = await transactionModel.getByReceiver(
      req.params.id
    );
    incomingTransactions.slice(0, 10);
    return res.status(200).json(incomingTransactions);
  } else {
    return res
      .status(401)
      .json({ error: "User not authorized to do that action" });
  }
};

const getAllWalletTransactions = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (verifyWallet._id == req.params.id) {
    const incomingTransactions = await transactionModel.getByReceiver(
      req.params.id
    );
    const outgoingTransactions = await transactionModel.getBySender(
      req.params.id
    );
    outgoingTransactions.map((e) => {
      const amountValue = currency.EURO(e.amount).value;
      e.amount = currency.EURO(-amountValue).format();
    });

    let allTransactions = incomingTransactions.concat(outgoingTransactions);
    allTransactions.sort((a, b) => {
      var c = new Date(a.date);
      var d = new Date(b.date);
      return d - c;
    });

    allTransactions = allTransactions.slice(0, 10);

    return res.status(200).json(allTransactions);
  } else {
    return res
      .status(401)
      .json({ error: "User not authorized to do that action" });
  }
};
const getBySenderLastWeek = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (verifyWallet._id == req.params.id) {
    try {
      const outgoingTransactions = await transactionModel.getBySender$DateRange(
        req.params.id
      );
      return res.status(200).json(outgoingTransactions);
    } catch (error) {
      console.log(error);
    }
  } else {
    return res
      .status(401)
      .json({ error: "User not authorized to do that action" });
  }
};
const getByReceiverLastWeek = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (verifyWallet._id == req.params.id) {
    try {
      const ingoingTransactions = await transactionModel.getByReceiver$DateRange(
        req.params.id
      );
      return res.status(200).json(ingoingTransactions);
    } catch (error) {
      console.log(error);
    }
  } else {
    return res
      .status(401)
      .json({ error: "User not authorized to do that action" });
  }
};

const getByReceiverSenderLastWeek = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (!(verifyWallet._id == req.params.id))
    return res.status(401).json("Unauthorized");
  const incomingTransactions = await transactionModel.getByReceiver$DateRange(
    req.params.id
  );
  const outgoingTransactions = await transactionModel.getBySender$DateRange(
    req.params.id
  );
  outgoingTransactions.map((e) => {
    const amountValue = currency.EURO(e.amount).value;
    e.amount = currency.EURO(-amountValue).format();
  });

  let allTransactions = incomingTransactions.concat(outgoingTransactions);
  allTransactions.sort((a, b) => {
    var c = new Date(a.date);
    var d = new Date(b.date);
    return d - c;
  });
  allTransactions.map((e) => (e.amount = currency.EURO(e.amount).value));
  return res.status(200).json(allTransactions);
};

const createStripeTransaction = async (paymentIntent, walletId) => {
  const paymentMethod = await stripe.paymentMethods.retrieve(
    paymentIntent.payment_method
  );
  const transaction = {
    receiver: walletId,
    stripeSender: paymentMethod.card.last4,
    amount: currency.EURO(paymentIntent.amount / 100).format(),
  };
  transactionModel.create(transaction);
};

module.exports = {
  handleTransaction,
  getTransactionsBySender,
  getTransactionsByReceiver,
  getAllWalletTransactions,
  getBySenderLastWeek,
  getByReceiverLastWeek,
  getByReceiverSenderLastWeek,
  createStripeTransaction,
};
