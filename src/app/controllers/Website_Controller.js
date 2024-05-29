const DbWebsiteConnection = require("../../DbWebsiteConnection");

class WebsiteController {
  index(req, res) {
    let sql = "select * from dual";
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
      const resPackage = await DbWebsiteConnection.execute(isdn);
      res.send({ result: resPackage });
    } else {
      res.send({ result: null });
    }
  }
}
module.exports = new WebsiteController();
