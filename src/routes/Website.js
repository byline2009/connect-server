const express = require("express");
const fs = require("fs");
const router = express.Router();
const websiteController = require("../app/controllers/Website_Controller");
const multer = require("multer");
const path = require("path");
const { mkdirSync } = require("fs");
const { checkFileType } = require("../utils/helper");
const { body } = require("express-validator");
// For Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./public/sale-point-upload";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const name = file.originalname.split(".")[0];
    const extension = path.extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join("");
    cb(null, `${name}-$${randomName}${extension}`);
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
  limit: {
    files: 10,
    fileSize: (1024 * 1024) / 20, //500k
  },
});
const upload = multer({ storage: storage });

router.use("/package", websiteController.getPackage);
router.use("/type", websiteController.getType);
router.get("/allSalePoint", websiteController.getAllSalePoint);
router.post(
  "/uploadAvatarSalePoint",
  upload.single("avatar"),
  websiteController.uploadAvatar
);
router.post(
  "/uploadImagesSalePoint",
  upload.array("images[]", 8),
  websiteController.uploadImageSalePoint
);
router.post(
  "/createSalePoint",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "images", maxCount: 8 },
  ]),
  body("shopID").notEmpty().escape().trim(),
  body("nameShop").notEmpty().escape().trim(),
  body("province").notEmpty().escape().trim(),
  body("district").notEmpty().escape(),
  body("ward").notEmpty().escape(),
  body("email").isEmail(),
  websiteController.createSalePoint
);
router.use("/", websiteController.index);

module.exports = router;
