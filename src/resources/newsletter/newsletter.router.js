const { Router } = require("express");
const newsletterController = require("./newsletter.controller");

const router = Router();

router
  .route("/")
//   .get(newsletterController.getAll)
  .post(newsletterController.create);

// router
//   .route("/:id")
//   .get(newsletterController.getOne)
//   .patch(newsletterController.update)
//   .delete(newsletterController.remove);

module.exports = router;
