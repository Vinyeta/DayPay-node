const { Router } = require("express");
const transactionController = require("./transactions.controller");

const router = Router();

router
  .route("/")
  .get(transactionController.getAll)
  .post(transactionController.create);

router
  .route("/:id")
  .get(transactionController.getOne)
  .patch(transactionController.update)
  .delete(transactionController.remove)
  .post(transactionController.handleTransaction);

router.route("/:id/sent").get(transactionController.getTransactionsBySender);
router
  .route("/:id/received")
  .get(transactionController.getTransactionsByReceiver);
router
  .route("/:id/sent/date")
  .get(transactionController.getBySenderLastWeek);
router
  .route("/:id/receiv/date")
  .get(transactionController.getByReceiverLastWeek);

module.exports = router;
