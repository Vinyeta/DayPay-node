const userModel = require("./users.model");


const getAll = async (req, res) => {
  const users = await userModel.getAll();
  return res.status(200).json(users);
};
const get = async (req, res) => {
  const user = await userModel.get(req.params.id);
  return res.status(200).json(user);
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
  update,
  get,
  remove,
  getAll,
};
