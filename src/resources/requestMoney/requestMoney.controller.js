const requestMoneyModel = require("./requestMoney.model");
const { validationResult } = require('express-validator');
const userModel = require('../users/users.model');
const walletModel = require('../wallet/wallet.model');
const currency = require("../../Utils/moneyFormating");


const get = async (req, res) => {
  const request = await requestMoneyModel.get(req.params.id);
  return res.status(200).json(request);
};
const create = async (req, res) => {
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
  const newRequest = {
    "sender": req.body.sender,
    "receiver": receiver._id,
    "amount": currency.EURO(req.body.amount).format()
  };
  const requestCreated = requestMoneyModel.create(newRequest);
  return res.status(201).json(requestCreated);

};
const update = (req, res) => {
  const updatedRequest = req.body;
  const requestUpdated = requestMoneyModel.update(req.params.id, updatedRequest);
  return res.status(200).json(requestUpdated);
};

const getByUser = async (req, res) => {
  try {
    const user = await userModel.get(req.params.id);
    const wallet = await walletModel.getByUser(user._id);
    let requests = await requestMoneyModel.getByWallet(wallet._id);
    requests = requests.slice(0, 5);

    return res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    res.status(400).json();
  }
};

module.exports = {
  create,
  update,
  get,
  getByUser
};


