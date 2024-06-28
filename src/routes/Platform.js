const express = require("express");
const router = express.Router();
const platformController = require("../app/controllers/PlatformControllers");
router.use("/export-excel", platformController.getFileExcel);
router.use("/:slug", platformController.show);
router.get("/", platformController.index);

module.exports = router;
