const express = require("express");
const router = express.Router();
const PTM_NVBH_TBTT_Controller = require("../app/controllers/PTM_NVBH_TBTT_Controllers");
router.use("/:slug", PTM_NVBH_TBTT_Controller.show);
router.get("/", PTM_NVBH_TBTT_Controller.index);

module.exports = router;
