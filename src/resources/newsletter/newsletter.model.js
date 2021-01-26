const mongoose = require("mongoose");

// Define model schema
const newsletterModelSchema = mongoose.Schema({
  email: String,
});

// Compile model from schema
const Newsletter = mongoose.model("NewsletterModel", newsletterModelSchema);

const create = (board) => {
  Newsletter.create(board, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Created Docs : ", docs);
    }
  });
};

const get = async (id) => {
  let query = { _id: id };
  return await Newsletter.findOne(query).populate("author"); //['firstName', 'email'] para pedir especifciamete esos datos.
};

const all = async () => {
  return await Newsletter.find().populate("author", "username");
};

const remove = (id) => {
  let query = { _id: id };
  Newsletter.deleteOne(query, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted Doc : ", docs);
    }
  });
};

const update = (id, updateboard) => {
  let query = { _id: id };
  Newsletter.updateOne(query, updateboard, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Updated Docs : ", docs);
    }
  });
};

module.exports = {
  create,
  update,
  remove,
  get,
  all,
};
