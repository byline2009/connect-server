const DbWebsiteConnection = require("../../DbWebsiteConnection");
const db = require("../../models");
const SalePoint = db.salepoint;
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
    console.log(
      "check",
      !req.body.shopID ||
        !req.body.nameShop ||
        !req.body.province ||
        !req.body.district ||
        !req.body.ward
    );
    if (
      !req.body.shopID ||
      !req.body.nameShop ||
      !req.body.province ||
      !req.body.district ||
      !req.body.ward
    ) {
      return res.status(400).send({ error: "Field is required" });
    } else {
      let info = {
        shopID: req.body.shopID,
        nameShop: req.body.nameShop ? req.body.nameShop : null,
        staffSupport: req.body.staffSupport ? req.body.staffSupport : null,
        personalID: req.body.personalID ? req.body.personalID : null,
        businessCode: req.body.businessCode ? req.body.businessCode : null,
        email: req.body.email ? req.body.email : null,
        phone: req.body.phone ? req.body.phone : null,
        province: req.body.province ? req.body.province : null,
        district: req.body.district ? req.body.district : null,
        ward: req.body.ward ? req.body.ward : null,
        address: req.body.address ? req.body.address : null,
        latitude: req.body.latitude ? req.body.latitude : null,
        longitude: req.body.longitude ? req.body.longitude : null,
        avatar: req.file && req.file.path ? req.file.path : null,
      };
      const salepoint = await SalePoint.create(info);
      res.status(200).send(salepoint);
      console.log(salepoint);
    }
  }
  async getAllSalePoint(req, res) {
    let salepoints = await SalePoint.findAll({});
    res.status(200).send(salepoints);
  }
}

module.exports = new WebsiteController();
