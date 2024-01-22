const express = require("express");
const router = express.Router();
const db01Controller = require("../app/controllers/DB01_Controller");
router.use("/", db01Controller.getPtmFromDb01);

module.exports = router;
