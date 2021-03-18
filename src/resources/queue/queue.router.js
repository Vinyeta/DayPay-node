const { Router } = require("express");
const queueController = require('./queue.controller');

const router = Router();

router
    .route('/msg')
    .post(queueController.sendMessage)
router
    .route('/')
    .get((req,res) => res.status(200).json('working'))


module.exports = router;