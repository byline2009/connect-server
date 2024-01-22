const express = require("express");
const router = express.Router();
const warningExpireContractController = require("../app/controllers/WarningExpireContract_Controller");
router.use("/export-excel", warningExpireContractController.getFileExcel);
router.use("/", warningExpireContractController.index);

module.exports = router;
