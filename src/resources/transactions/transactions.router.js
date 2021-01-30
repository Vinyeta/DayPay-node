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

module.exports = router;
