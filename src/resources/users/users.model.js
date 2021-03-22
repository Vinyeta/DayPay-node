const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const walletModel = require("../wallet/wallet.model");
const currency = require("../../Utils/moneyFormating");

const userModelSchema = mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  trustedContacts: Array,
  avatar: String,
});

userModelSchema.pre("save", async function (next) {
  //antes de cada save, se ejecuta esto, ,por esto el pre.
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compile model from schema
const User = mongoose.model("UserModel", userModelSchema);

const create = (user) => {
  const newUser = new User(user);
  newUser.save(user, function (err, docs) {
    if (err) {
      return console.log(err);
    } else {
      console.log("Created Docs : ", docs);
    }
  });
  walletModel.Wallet.create({
    author: newUser._id,
    funds: currency.EURO(0).format(),
  });
};

const get = async (id) => {
  let query = { _id: id };
  return await User.findOne(query);
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

const getByEmail = async (mail) => {
  let query = { email: mail };
  return await User.findOne(query);
};

const update = async (id, updateUser) => {
  let query = { _id: id };
  const salt = await bcrypt.genSalt();
  updateUser.password = await bcrypt.hash(updateUser.password, salt);
  User.updateOne(query, updateUser, function (err, docs) {
    if (err) {
      console.log(`error al realizar la petición ${err}`);
    } else {
      console.log("Updated Docs : ", docs);
    }
  });
};

const login = async (email, password) => {
  //buscador de correos y comparador de password normal con la encryptada.
  const user = await User.findOne({ email: email });
  console.log(user);
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

module.exports = {
  create,
  remove,
  get,
  getByEmail,
  update,
  login,
};
