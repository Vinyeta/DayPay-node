const currency = require("currency.js");

const EURO = (value) =>
  currency(value, { symbol: "€", decimal: ",", separator: "." });

module.exports = {
  EURO,
};
