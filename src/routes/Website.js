const express = require("express");
const router = express.Router();
const websiteController =
  require("../app/controllers/Website_Controller").default;
router.use("/package", websiteController.getPackage);
router.use("/", websiteController.index);

module.exports = router;
