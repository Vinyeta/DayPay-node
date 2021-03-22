const { Router } = require("express");
const userController = require("./users.controller");

const router = Router();

router
  .route("/:id")
  .get(userController.get)
  .delete(userController.remove)
  .patch(userController.update);

module.exports = router;
