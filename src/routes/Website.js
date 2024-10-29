const express = require("express");
const router = express.Router();
const websiteController = require("../app/controllers/Website_Controller");
router.use("/package", websiteController.getPackage);
router.use("/type", websiteController.getType);
router.use("/", websiteController.index);

module.exports = router;
