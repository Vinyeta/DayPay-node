const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const walletModel = require("../wallet/wallet.model")

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
      console.log(err);
    } else {
      console.log("Created Docs : ", docs);
    }
  })
  walletModel.Wallet.create( {"author": newUser._id, "funds":0});
};

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

const getByEmail = async (mail) => {
  let query = { email: mail };
  return await User.findOne(query);
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

const login = async (email, password) => {
  //buscador de correos y comparador de password normal con la encryptada.
  const user = await User.findOne({ email });
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
  getAll,
  getByEmail,
  update,
  login,
};
