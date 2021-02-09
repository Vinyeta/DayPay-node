const mongoose = require("mongoose");

const userModelSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String, //deberia tener una referencia a las wallets? o payment method.
  trustedContacts: Array,
  avatar: String,
});

// Compile model from schema
const User = mongoose.model("UserModel", userModelSchema);

const create = (user) => {
  User.create(user, function (err, docs) {
    if (err) console.log(`error al realizar la petición ${err}`);
    else console.log("Created Docs : ", docs);
  });
};
//es con docs?
const get = async (id) => {
  let query = { _id: id };
  return await User.findOne(query);
};

const getAll = async () => {
  return await User.find();
};

const remove = (id) => {
  let query = { _id: id };
  User.deleteOne(query, function (err, docs) {
    if (err) {
      console.log(`error al realizar la petición ${err}`);
    } else {
      console.log("Deleted Doc : ", docs);
    }
  });
};

const update = (id, updateUser) => {
  let query = { _id: id };
  User.updateOne(query, updateUser, function (err, docs) {
    if (err) {
      console.log(`error al realizar la petición ${err}`);
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
  getAll,
};
