const DbConnection = require("../../DbConnection");
var moment = require("moment"); // require

class DB01_Controller {
  getPtmFromDb01(req, res) {
    // Define the home page route
    const month = req.query.month;
    const year = req.query.year;
    const monthFix = month < 10 ? "0" + month : month;
    const selectMonthYear = "01/" + monthFix + "/" + year;
    var d = new Date();
    const plainDate = moment(d.setDate(d.getDate() - 5)).format("DD/MM/YYYY");
    console.log("plainDate", plainDate);
    // DbConnection.getConnected(
    //   `select count(*) from (
    //    select * from db01_owner.tb_ptm_tt a where a.file_date >= to_date(:selectMonthYear,'dd/mm/rrrr')
    //    and a.file_date < to_date(:plainDate,'dd/mm/rrrr'))`,
    //   { selectMonthYear: selectMonthYear, plainDate: plainDate },
    //   function (result) {
    //     console.log("result", result);
    //     res.send({ data: result[0][0], totalCount: result[0][0] });
    //   }
    // );
    DbConnection.getConnected(
      "select * from (select sl  from sale_owner.local_tbtt_ptm_hourly  order by time desc ) where rownum = 1",
      {},
      function (result) {
        console.log("result", result);
        res.send({ data: result, totalCount: result });
      }
    );
  }
  show(req, res) {
    console.log("check");
    res.send("detail");
  }
}
module.exports = new DB01_Controller();
