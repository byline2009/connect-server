const { Association } = require("sequelize");
var Sequelize = require("sequelize");
const DbWebsiteConnection = require("../../DbWebsiteConnection");
const db = require("../../models");
const fs = require("fs");
const SalePoint = db.salepoint;
const ImageSalePoint = db.images;
const { sequelize } = require('../../models'); // Import sequelize từ nơi đã cấu hình

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
  
    console.log("test",req.files, req.files["avatar"] )
    // Lưu đường dẫn avatar nếu có
    let fileAvatarPath = null;
    if (req.files && req.files["avatar"] && req.files["avatar"][0]) {
      fileAvatarPath = req.files["avatar"][0].path.replace(/\\/g, "/");
    }
  
    if (result.isEmpty()) {
      let info = {
        createdBy: req.body.createdBy,
        shopID: req.body.shopID,
        nameShop: req.body.nameShop || null,
        staffSupport: req.body.staffSupport || null,
        personalID: req.body.personalID || null,
        staffCode: req.body.staffCode || null,
        shopCode: req.body.shopCode || null,
        email: req.body.email || null,
        phone: req.body.phone || null,
        province: req.body.province || null,
        provinceCode: req.body.provinceCode || null,
        district: req.body.district || null,
        districtCode: req.body.districtCode || null,
        ward: req.body.ward || null,
        wardCode: req.body.wardCode || null,
        address: req.body.address || null,
        latitude: req.body.latitude || null,
        longitude: req.body.longitude || null,
        avatar: fileAvatarPath || null,
      };
  
      try {
        console.log("Thông tin điểm bán:", info);
  
        // Kiểm tra sự tồn tại của shopID trong bảng sale_owner.V_EMPLOYEE_TCQLKH
        const existingEmployee = await sequelize.query(
          `SELECT * FROM sale_owner.V_EMPLOYEE_TCQLKH WHERE emp_code = :shopID`,
          {
            replacements: { shopID: info.shopID },
            type: sequelize.QueryTypes.SELECT,
          }
        );
  
        if (existingEmployee.length === 0) {
          throw new Error(`Mã Điểm Bán ${info.shopID} không tồn tại trong hệ thống.`);
        }
  
        // Kiểm tra nếu shopID đã tồn tại trong bảng SalePoint
        const existingSalePoint = await SalePoint.findOne({ where: { shopID: info.shopID } });
        if (existingSalePoint) {
          throw new Error("Mã Điểm Bán Đã Được Khai Báo Trước Đó");
        }
  
        // Xử lý hình ảnh
        const arrayImage = [];
        if (req.files && req.files["images"]) {
          req.files["images"].forEach((file) => {
            const pathImage = file.path.replace(/\\/g, "/");
            arrayImage.push({
              imageName: file.filename,
              imageUrl: pathImage,
            });
          });
        }
  
        const infoFinal = { ...info, images: arrayImage };
  
        // Tạo SalePoint mới
        const salepoint = await SalePoint.create(infoFinal, {
          include: [{ model: ImageSalePoint, as: "images" }],
        });
  
        console.log("SalePoint created successfully:", salepoint);
        res.status(200).send(salepoint);
      } catch (error) {
        console.error("Lỗi trong quá trình tạo SalePoint:", error.message);
  
        // Nếu có lỗi, xóa file đã upload
        if (req.files) {
          if (req.files["avatar"] && req.files["avatar"][0]) {
            try {
              fs.unlinkSync(req.files["avatar"][0].path);
              console.log("Xóa avatar file thành công");
            } catch (err) {
              console.error("Lỗi khi xóa avatar file:", err);
            }
          }
          if (req.files["images"]) {
            req.files["images"].forEach((file) => {
              try {
                fs.unlinkSync(file.path);
                console.log("Xóa file image thành công");
              } catch (err) {
                console.error("Lỗi khi xóa file image:", err);
              }
            });
          }
        }
  
        // Trả về lỗi cho client
        res.status(400).send({ errors: [{ msg: error.message }] });
      }
    } else {
      // Nếu validation không thành công, trả về lỗi
      console.error("Dữ liệu gửi lên không hợp lệ:", result.array());
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
      try {
        const salepoint = await SalePoint.findOne({
          where: { shopID: shopID },
          include: [{ model: ImageSalePoint, as: "images" }],
        });
        console.log(salepoint);
        if (salepoint) {
          const { avatar } = salepoint;
          if (avatar) {
            console.log("avatar", avatar);
            fs.unlink(avatar, (err) => {
              console.error(err);
              if (err) throw err;
              console.log("The file was deleted");
            });
          }
          console.log(salepoint);
          if (salepoint.images && salepoint.images.length > 0) {
            salepoint.images.map(async (image) => {
              fs.unlink(image.imageUrl, (err) => {
                if (err) throw err;
                console.log("The file was deleted");
              });
              await ImageSalePoint.destroy({ where: { id: image.id } });
            });
          }

          await SalePoint.destroy({ where: { shopID: shopID } }).then(
            async function (rowDeleted) {
              // rowDeleted will return number of rows deleted
              if (rowDeleted === 1) {
                console.log("Deleted successfully");
                return res.status(200).send({ message: "Delete successfully" });
              } else {
                return res
                  .status(400)
                  .send({ message: "Delete unsuccessfully" });
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
      } catch (error) {
        return res.status(400).send(error);
      }
    }
  }
}

module.exports = new WebsiteController();