const { Router } = require("express");
const authController = require("./auth.controller");
const router = Router();

router.route("/login").post(authController.login2); 
router.route("/signUp").post(authController.signUp);

module.exports = router;
