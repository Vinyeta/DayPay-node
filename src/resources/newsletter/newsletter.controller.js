const newsletterModel = require("./newsletter.model");

const e = require("cors");

const getAll = async (req, res) => {
  const newsletter = await newsletterModel.all();

  return res.status(200).json(newsletter);
};

const getOne = async (req, res) => {
  const newsletter = await newsletterModel.get(req.params.id);
  if (newsletter) {
    return res.status(200).json(newsletter);
  }
  return res.status(404).end();
};

const create = (req, res) => {
  const newEmail = req.body;
  const newsletterCreated = newsletterModel.create(newEmail);

  return res.status(201).json(newsletterCreated);
};

const update = (req, res) => {
  const updatedEmail = req.body;

  const newsletterUpdated = newsletterModel.update(req.params.id, updatedEmail);

  return res.status(200).json(newsletterUpdated);
};

const remove = (req, res) => {
  const newsletterWithoutTheDeleted = newsletterModel.remove(req.params.id);

  return res.status(200).json(newsletterWithoutTheDeleted);
};

module.exports = {
  create,
  update,
  getAll,
  getOne,
  remove,
};
