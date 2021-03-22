const { Router } = require("express");
const queueController = require("./queue.controller");

const router = Router();

router.route("/msg").post(queueController.sendMessage);

module.exports = router;
