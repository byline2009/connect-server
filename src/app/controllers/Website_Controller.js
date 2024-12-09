const { Association } = require("sequelize");
var Sequelize = require("sequelize");
const DbWebsiteConnection = require("../../DbWebsiteConnection");
const db = require("../../models");
const SalePoint = db.salepoint;
const ImageSalePoint = db.images;

const { query, validationResult } = require("express-validator");
class WebsiteController {
  index(req, res) {
    let sql = "select sysdate from dual";
    DbWebsiteConnection.getConnected(sql, {}, function (result) {
      if (result) {
        result.map((item, index) => {});
      }
      res.send({ result: result });
    });
  }
  async getPackage(req, res) {
    const isdn = req.query.isdn;
    if (isdn) {
      const resQuery = await DbWebsiteConnection.execute(isdn);
      console.log("check", resQuery);
      DbWebsiteConnection.getConnected(resQuery, {}, function (result) {
        console.log(result);
        res.send({ result: result });
      });
    } else {
      res.send({ result: null });
    }
  }
  async getType(req, res) {
    const isdn = req.query.isdn;
    if (isdn) {
      const resQuery = await DbWebsiteConnection.checkType(isdn);
      console.log("check", resQuery);
      res.send({ result: resQuery });
    } else {
      res.send({ result: null });
    }
  }
  uploadAvatar(req, res) {
    if (req.file) {
      console.log("uploadAvatar", req.file);
    }
    res.send({ result: { message: "Hello, world!" } });
  }

  uploadImageSalePoint(req, res) {
    console.log(req);
    res.send({ result: { message: req.file } });
  }

  async createSalePoint(req, res) {
    const result = validationResult(req);
    // console.log("validation", result);
    let fileAvatarPath = null;
    if (req.files && req.files["avatar"] && req.files["avatar"][0]) {
      fileAvatarPath = req.files["avatar"][0].path.replace(/\\/g, "/");
    }

    if (result.isEmpty()) {
      let info = {
        shopID: req.body.shopID,
        nameShop: req.body.nameShop ? req.body.nameShop : null,
        staffSupport: req.body.staffSupport ? req.body.staffSupport : null,
        personalID: req.body.personalID ? req.body.personalID : null,
        staffCode: req.body.staffCode ? req.body.staffCode : null,
        shopCode: req.body.shopCode ? req.body.shopCode : null,
        email: req.body.email ? req.body.email : null,
        phone: req.body.phone ? req.body.phone : null,
        province: req.body.province ? req.body.province : null,
        district: req.body.district ? req.body.district : null,
        ward: req.body.ward ? req.body.ward : null,
        address: req.body.address ? req.body.address : null,
        latitude: req.body.latitude ? req.body.latitude : null,
        longitude: req.body.longitude ? req.body.longitude : null,
        avatar:
          req.files && req.files["avatar"] && req.files["avatar"][0]
            ? fileAvatarPath
            : null,
      };
      console.log("req.files", req.files);
      let product = await SalePoint.findOne({ where: { shopID: info.shopID } });
      console.log("product", product);
      if (product) {
        return res
          .status(400)
          .send({ errors: [{ msg: "Sale point is existed" }] });
      }
      try {
        const arrayImage = [];
        if (req.files && req.files["images"]) {
          req.files["images"].map(async (item, index) => {
            const pathImage = req.files["images"][index].path.replace(
              /\\/g,
              "/"
            );
            const infoImage = {
              imageName: req.files["images"][index].filename,
              imageUrl: pathImage,
            };
            arrayImage.push(infoImage);
          });
        }
        const infoFinal = { ...info, images: arrayImage };
        const salepoint = await SalePoint.create(infoFinal, {
          include: [{ model: ImageSalePoint, as: "images" }],
        });
        res.status(200).send(salepoint);
        console.log(salepoint);
      } catch (error) {
        throw new Error(error);
      }
    } else {
      res.status(400).send({ errors: result.array() });
    }
  }
  async getAllSalePoint(req, res) {
    const { offset, limit } = req.query;
    if (offset && limit) {
    }
    let salepoints = await SalePoint.findAll({
      offset: offset ? offset : 0,
      limit: limit ? limit : 10,
      order: [["nameShop"]],
      include: [{ model: ImageSalePoint, as: "images" }],
    });
    res.status(200).send(salepoints);
  }
  async deleteSalePoint(req, res) {
    const { shopID } = req.params;
    if (shopID) {
      const salepoint = await SalePoint.findOne({ shopID: shopID });
      if (salepoint) {
        await SalePoint.destroy({ where: { shopID: shopID } }).then(
          function (rowDeleted) {
            // rowDeleted will return number of rows deleted
            if (rowDeleted === 1) {
              console.log("Deleted successfully");
              return res.status(200).send({ message: "Delete successfully" });
            } else {
              return res.status(400).send({ message: "Delete unsuccessfully" });
            }
          },
          function (err) {
            console.log(err);
            return res.status(400).send(err);
          }
        );
      } else {
        return res
          .status(400)
          .send({ errors: [{ msg: "Sale point is not existed" }] });
      }
    }
  }
}

module.exports = new WebsiteController();
