const mongoose = require("mongoose");

const walletModel = require("../wallet/wallet.model");

// Define model schema
const transactionsModelSchema = mongoose.Schema({
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WalletModel",
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WalletModel",
  },
  concept: String,
  date: { type: Date, default: Date.now },
  amount: Number,
});

// Compile model from schema
const Transaction = mongoose.model(
  "TransactionsModel",
  transactionsModelSchema
);

const create = (transaction) => {
  Transaction.create(transaction, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Created Docs : ", docs);
    }
  });
};

const get = async (id) => {
  let query = { _id: id };
  return await Transaction.findOne(query).populate("author"); //['firstName', 'email'] para pedir especifciamete esos datos.
};

const all = async () => {
  return await Transaction.find()
    .populate("receiver", "author")
    .populate("sender", "author");
};

const remove = (id) => {
  let query = { _id: id };
  Transaction.deleteOne(query, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted Doc : ", docs);
    }
  });
};

const update = (id, updatetransaction) => {
  let query = { _id: id };
  Transaction.updateOne(query, updatetransaction, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Updated Docs : ", docs);
    }
  });
};

const transaction = (id) => {
  let query = { _id: id };
  return walletModel.findOneAndUpdate(
    { query },
    { saldo: saldo },
    { new: true }
  );
};

const getBySender = (walletId) => {
  let query = { sender: walletId };
  return Transaction.find(query)
    .sort({ date: -1 })
    .populate("receiver", "author")
    .populate("sender", "author");
};
const getByReceiver = (walletId) => {
  let query = { receiver: walletId };
  return Transaction.find(query)
    .sort({ date: -1 })
    .populate("receiver", "author")
    .populate("sender", "author");
};

const getBySender$DateRange = (walletId) => {
  const currentDate = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  let query = {
    $and: [{ sender: walletId }, {
      date: {
        $gte: lastWeek,
        $lt: currentDate
      }
    }
    ]
  };
  return Transaction.find(query)
    .sort({ date: -1 })
};
const getByReceiver$DateRange = (walletId) => {
  const currentDate = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  let query = {
    $and: [{ receiver: walletId }, {
      date: {
        $gte: lastWeek,
        $lt: currentDate
      }
    }
    ]
  };
  return Transaction.find(query)
    .sort({ date: -1 })
};

module.exports = {
  create,
  update,
  remove,
  get,
  all,
  transaction,
  getBySender,
  getByReceiver,
  getBySender$DateRange,
  getByReceiver$DateRange
};
