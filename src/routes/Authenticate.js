const express = require("express");
const router = express.Router();
const authenticateController = require("../app/controllers/Authenticate_Controller");
router.use("/", authenticateController.index);

module.exports = router;
