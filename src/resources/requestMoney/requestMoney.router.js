const { Router } = require("express");
const requestMoneyController = require("./requestMoney.controller");
const { body } = require('express-validator');


const router = Router();



router.route('/')
  .post( body('email').isEmail(),
        body('amount').isNumeric(),
            requestMoneyController.create,
      );

router
    .route('/:id')
    .get(requestMoneyController.get)
    .patch(requestMoneyController.update)

router  
    .route('/:id/user')
    .get(requestMoneyController.getByUser);
    
module.exports = router;
