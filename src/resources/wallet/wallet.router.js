const { Router } = require("express");
const walletController = require("./wallet.controller");
const router = Router();

router.route("/").post(walletController.createOne);

router
  .route("/:id")
  .get(walletController.getOne)
  .patch(walletController.update);

router.route("/:id/author").get(walletController.getByUserId);

router.route("/:id/balance").get(walletController.getBalance);

router.route("/:id/increment").get(walletController.weeklyIncrement);

router.route("/:id/stripePayment").patch(walletController.stripePayment);

router.route("/:id/histogram").get(walletController.walletHistogram);

module.exports = router;
