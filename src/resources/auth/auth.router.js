const { Router } = require("express");
const authController = require("./auth.controller");
const router = Router();
const { body } = require('express-validator');

router.route("/login").post(authController.login2); 
router
.route("/signUp")
.post(
    body('password').isLength({min: 5 }),
    body('email').isEmail(),
    authController.signUp);

module.exports = router;