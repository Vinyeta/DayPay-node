const requestMoneyModel = require("./requestMoney.model");
const { validationResult } = require('express-validator');
const userModel = require('../users/users.model');
const walletModel = require('../wallet/wallet.model');
const currency = require("../../Utils/moneyFormating");
const jwt = require("jsonwebtoken");



const get = async (req, res) => {
  const request = await requestMoneyModel.get(req.params.id);
  return res.status(200).json(request);
};
const create = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (verifyWallet._id.toString() == req.body.sender) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  value = req.body.amount
  if (value < 0) {
    return res.status(400).json("Invalid value");
  }
  const targetUser = await userModel.getByEmail(req.body.receiver);
  const receiver = await walletModel.getByUser(targetUser._id)
  if (req.body.sender == receiver._id) return res.status(400).json('Cannot request money to yourself')
  const newRequest = {
    "sender": req.body.sender,
    "receiver": receiver._id,
    "amount": currency.EURO(req.body.amount).format()
  };
  const requestCreated = requestMoneyModel.create(newRequest);
  return res.status(201).json(requestCreated);}

};
const update = async (req, res) => {
  const request = await requestMoneyModel.get(req.params.id);
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (verifyWallet._id.toString() == request.receiver.toString()) {
    const updatedRequest = req.body;
    const requestUpdated = requestMoneyModel.update(req.params.id, updatedRequest);
    return res.status(200).json(requestUpdated);
  } else {
    return res.status(401).json({ error: "User not authorized to do that action" });
  }
};

const getByUser = async (req, res) => {
  const user = jwt.decode(req.headers.authorization.split(" ")[1]);
  if (user._id == req.params.id) {
  try {
    const user = await userModel.get(req.params.id);
    const wallet = await walletModel.getByUser(user._id);
    let requests = await requestMoneyModel.getByWallet(wallet._id);
    requests = requests.slice(0, 5);

    return res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    res.status(400).json();
  }} else {
    return res.status(401).json({ error: "User not authorized to do that action" });
  }
};

module.exports = {
  create,
  update,
  get,
  getByUser
};


