const { Router } = require("express");
const requestMoneyController = require("./requestMoney.controller");


const router = Router();

router
    .route("/")
    .post(requestMoneyController.create)
router
    .route('/:id')
    .get(requestMoneyController.get)
    .patch(requestMoneyController.update)
    
module.exports = router;
