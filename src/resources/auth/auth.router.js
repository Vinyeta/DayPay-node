const { Router } = require("express");
const authController = require("./auth.controller");
const router = Router();
const { body, validationResult } = require('express-validator');

router.route("/").post(authController.login2);

module.exports = router;
