const express = require("express");
const router = express.Router();
const employeeOffController = require("../app/controllers/EmployeeOffControllers");
router.use("/export-excel", employeeOffController.getFileExcel);
router.use("/:slug", employeeOffController.show);
router.get("/", employeeOffController.index);

module.exports = router;
