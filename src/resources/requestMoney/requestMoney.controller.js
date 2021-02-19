const requestMoneyModel = require("./requestMoney.model");
const { validationResult } = require('express-validator');
const userModel = require('../users/users.model');
const walletModel = require('../wallet/wallet.model');



const get = async (req, res) => {
  const request = await requestMoneyModel.get(req.params.id);
  return res.status(200).json(request);
};
const create = async (req, res) => {
  const targetUser = await  userModel.getByEmail(req.body.receiver);
  const receiver = await walletModel.getByUser(targetUser._id)
  const newRequest = {
    "sender": req.body.sender,
    "receiver": receiver._id,
    "amount": req.body.amount
  };
  const requestCreated = requestMoneyModel.create(newRequest);
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    value = req.body.amount
      value >= 0;
      if (value < 0 ) {
          return res.status(400).json("Invalid value");
        }
      return res.status(201).json(requestCreated);
};    
const update = (req, res) => {
  const updatedRequest = req.body;
  const requestUpdated = requestMoneyModel.update(req.params.id, updatedRequest);
  return res.status(200).json(requestUpdated);
};


module.exports = {
  create,
  update,
  get
};


