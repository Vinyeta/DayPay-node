const { Router } = require("express");
const stripeController = require("./stripe.controller");

const router = Router();

router
    .route('/payment')
    .post(stripeController.stripePayment);

router
    .route('/')
    .get((req,res) => {return res.status(200).json('Ok')});

module.exports = router;