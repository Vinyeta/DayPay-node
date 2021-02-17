const { Router } = require("express");
const requestMoneyController = require("./requestMoney.controller");
const { body, validationResult } = require('express-validator');


const router = Router();


router.route('/')
  .get(usersController.getAll)
  .post( body('email').isEmail(),
          usersController.create,
      );

router
    .route('/:id')
    .get(requestMoneyController.get)
    .patch(requestMoneyController.update)
    
module.exports = router;
