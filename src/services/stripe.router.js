const { Router } = require("express");
const stripeController = require("./stripe.controller");
const router = Router();

router.route('/payment').post(stripeController.stripePayment);

module.exports=router;
