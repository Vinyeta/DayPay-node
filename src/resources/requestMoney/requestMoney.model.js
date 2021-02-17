const mongoose = require("mongoose");

const walletModel = require("../wallet/wallet.model");
//modelo del requestMoney

const Transitions = Object.freeze ({
  Pending: "pending",
  Rejected: "rejected",
  Cancelled: "cancelled",
  Accepted: "accepted",
});

const requestMoneyModelSchema = mongoose.Schema({
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalletModel",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalletModel",
    },
    status: {
      type: String,
      enum: Object.values(Transitions),
    },
    concept: String,
    date: { type: Date, default: Date.now },
    amount: Number,
  });
 
 
  Object.assign(requestMoneyModelSchema.statics, {
    Transitions,
  });


// COMPILE MODEL FROM SCHEMA 

const RequestMoney = mongoose.model("RequestMoneyModel", requestMoneyModelSchema);


const create = (request) => {
  request.status = Transitions.Pending;
  RequestMoney.create(request, function( err, docs) {
      if (err) {
          console.log(err);
      } else {
        console.log("Created Docs:" , docs);
      }
    });
};

const update = (id, request) => {
  let query = { _id: id };
  RequestMoney.updateOne(query, request, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Update Request :", docs)
    }
  });
};

const get = async (id) => {
let query ={_id: id};
return await RequestMoney.findOne(query)
};

module.exports = {
  create,
  update,
  get
};