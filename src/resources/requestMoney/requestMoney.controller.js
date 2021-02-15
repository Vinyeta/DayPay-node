const requestMoneyModel = require("./requestMoney.model");


const get = async (req, res) => {
  const request = await requestMoneyModel.get(req.params.id);
  return res.status(200).json(request);
};
const create = (req, res) => {
  const newRequest = req.body;
  const requestCreated = requestMoneyModel.create(newRequest);
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


