const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
mongoose.set("debug", process.env.NODE_ENV === "development");
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const mongo = mongoose.connect(process.env.DB_CONN_STR, options);

mongo.then(
  () => {
    console.log(
      `Mongoose default connection open to ${process.env.DB_CONN_STR}`
    );
  },
  (error) => {
    console.log(error, "error");
  }
);

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

module.exports = mongo;
