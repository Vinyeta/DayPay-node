const userModel = require("./users.model");
const TransactionsModel = require("../transactions/transactions.model");


const getAll = async (req, res) => {
  const users = await userModel.getAll();
  return res.status(200).json(users);
};
const get = async (req, res) => {
  const user = await userModel.get(req.params.id);
  return res.status(200).json(user);
};
const create = async (req, res) => {
  const newUser = req.body;
  const userCreated = await userModel.create(newUser)
  .then( (response) => {
    const newUserWallet = {
    "author": response._id,
    "funds": 0
  };
  const walletCreated = walletModel.create(newUserWallet)})
  
  return res.status(201).json(userCreated);
};
const update = (req, res) => {
  const updatedUser = req.body;
  const userUpdated = userModel.update(req.params.id, updatedUser);
  return res.status(200).json(userUpdated);
};
const remove = (req, res) => {
  const userDeleted = userModel.remove(req.params.id);
  return res.status(200).json(userDeleted);
};

module.exports = {
  create,
  update,
  get,
  remove,
  getAll,
};
