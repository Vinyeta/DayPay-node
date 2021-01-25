const express = require("express");
const { json, urlencoded } = require("body-parser");
const morgan = require("morgan");
const config = require("./config.js");
const cors = require("cors");
const newsletterRouter = require("./resources/newsletter/newsletter.router");
const jwt = require("express-jwt");
const dotenv = require("dotenv");
const mongo = require("./config/mongo");

dotenv.config();
const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));
app.disable("x-powered-by");

app.use("/api/newsletter", newsletterRouter);

const start = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`);
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  start,
  app,
};
