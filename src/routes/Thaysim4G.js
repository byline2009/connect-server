const express = require("express");
const router = express.Router();
const thaySim4GController = require("../app/controllers/ThaySim4GControllers");
router.use("/export-excel", thaySim4GController.getFileExcel);
router.use("/:slug", thaySim4GController.show);
router.use("/", thaySim4GController.index);

module.exports = router;
