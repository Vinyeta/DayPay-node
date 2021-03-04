const express = require("express");
const { json, urlencoded } = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("express-jwt");
const dotenv = require("dotenv");
const config = require("./config.js");
const walletRouter = require("./resources/wallet/wallet.router.js");
const mongo = require("./config/mongo");
const transactionRouter = require("./resources/transactions/transactions.router");
const newsletterRouter = require("./resources/newsletter/newsletter.router");
const userRouter = require("./resources/users/users.router");
const authRouter = require("./resources/auth/auth.router");
const requestMoneyRouter = require("./resources/requestMoney/requestMoney.router");
const path = require("path");
global.appRoot = path.resolve(__dirname);

const app = express();
const jwtProtection = jwt( { secret: process.env.TOKEN_SECRET, algorithms: ['HS256'] } );
const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");


app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static("."));


app.disable("x-powered-by");
app.use("/api/auth", authRouter);
app.use("/api/wallet", jwtProtection, walletRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/users", jwtProtection, userRouter);
app.use("/api/transactions", jwtProtection, transactionRouter);
app.use("/api/requestMoney", jwtProtection, requestMoneyRouter);



app.post("/create-payment-intent", async (req, res) => {
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "eur"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
});


const start = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}`);
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  start,
  app,
};