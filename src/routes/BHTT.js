const express = require("express");
const router = express.Router();
const bhttController = require("../app/controllers/BHTT_Controller");
router.use("/", bhttController.index);

module.exports = router;
