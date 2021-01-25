const { Router } = require('express');
const walletController = require('./wallet.controller');
const router = Router();

router
  .route('/:id')
  .get(walletController.getOne)
  .patch(walletController.update)
  .post(walletController.create)
  .delete(walletController.remove);


module.exports = router;