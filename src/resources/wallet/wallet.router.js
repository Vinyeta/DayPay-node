const { Router } = require('express');
const walletController = require('./wallet.controller');
const router = Router();

router.route("/").post(walletController.createOne);

router
  .route('/:id')
  .get(walletController.getOne)
  .patch(walletController.updateOne);

router
  .route('/:id/author')
  .get(walletController.getByUserId);

router
  .route('/:id/balance')
  .get(walletController.getBalance);
  
  


module.exports = router;