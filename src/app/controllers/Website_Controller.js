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

    // let sql = `declare
    // f_resul CLOB;
    // begin
    // :f_resul := F_call_soap_api_flowone(777555565);
    // end;`;
    // DbWebsiteConnection.getConnected(sql, {}, function (result) {
    //   console.log("check ne", result);
    //   if (result) {
    //     // result.map((item, index) => {});
    //   }
    //   res.send({ result: result });
    // });
  }
}
module.exports = new WebsiteController();
