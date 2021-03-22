const userModel = require("./users.model");
const e = require("cors");



const get = async (req, res) => {
  const user = await userModel.get(req.params.id);
  return res.status(200).json(user);
};
const create = (req, res) => {
  const newUser = req.body;
  const userCreated = userModel.create(newUser);
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
};
