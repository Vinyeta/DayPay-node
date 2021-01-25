const mongoose = require('mongoose');
// Define model schema
const walletModelSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WalletModel',
      },
  comment: String,
  paymentMethod: Array,
});
// Compile model from schema
const Wallet = mongoose.model('WalletModel', walletModelSchema);
const create = (wallet) => {
  Wallet.create(wallet, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log('Created Docs : ', docs);
    }
  });
};
const get = async (id) => {
  let query = { _id: id };
  return await Newsletter.findOne(query);
};
const all = async () => {
  return await Wallet.find().populate('id');
};
const remove = (id) => {
  let query = { _id: id };
  Wallet.deleteOne(query, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log('Deleted Doc : ', docs);
    }
  });
};
const update = (id, updatewallet) => {
  let query = { _id: id };
  Wallet.updateOne(query, updateWallet, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log('Updated Docs : ', docs);
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