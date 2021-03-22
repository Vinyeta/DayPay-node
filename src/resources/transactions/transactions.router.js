const { Router } = require("express");
const transactionController = require("./transactions.controller");
const { body } = require("express-validator");

const router = Router();

router
  .route("/")
  .post(
    body("amount").isNumeric(),
    body("receiver").isEmail(),
    transactionController.handleTransaction
  );

router.route("/:id/sent")
  .get(transactionController.getTransactionsBySender);
router
  .route("/:id/received")
  .get(transactionController.getTransactionsByReceiver);

router.route("/:id/all").get(transactionController.getAllWalletTransactions);
router.route("/:id/sent/date").get(transactionController.getBySenderLastWeek);
router
  .route("/:id/receiv/date")
  .get(transactionController.getByReceiverLastWeek);

router
  .route("/:id/lastWeek")
  .get(transactionController.getByReceiverSenderLastWeek);

module.exports = router;
