const { Router } = require("express");
const requestMoneyController = require("./requestMoney.controller");
const { body } = require("express-validator");

const router = Router();

router
  .route("/")
  .post(
    body("receiver").isEmail(),
    body("amount").isNumeric(),
    requestMoneyController.create
  );

router
  .route("/:id")
  .patch(requestMoneyController.update);

router.route("/:id/user")
  .get(requestMoneyController.getByUser);

module.exports = router;
