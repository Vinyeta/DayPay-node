const { Router } = require("express");
const transactionController = require("./transactions.controller");
const { body, validationResult } = require('express-validator');

const router = Router();

router.route('/')
  .get(usersController.getAll)
  .post(  body('password').isLength({min: 5 }),
          body('email').isEmail(),
          usersController.create,
      );

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

router.route("/:id/all").get(transactionController.getAllWalletTransactions);
router
  .route("/:id/sent/date")
  .get(transactionController.getBySenderLastWeek);
router
  .route("/:id/receiv/date")
  .get(transactionController.getByReceiverLastWeek);

module.exports = router;
