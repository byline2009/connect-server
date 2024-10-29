const DbWebsiteConnection = require("../../DbWebsiteConnection");

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
}
module.exports = new WebsiteController();
