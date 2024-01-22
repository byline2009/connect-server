const DbConnection = require("../../DbConnection");
var moment = require("moment"); // require

class BHTT_Controller {
  index(req, res) {
    // Define the home page route
    const month = req.query.month;
    const year = req.query.year;
    const monthFix = month < 10 ? "0" + month : month;
    const selectMonthYear = "01/" + monthFix + "/" + year;
    var d = new Date();
    const plainDate = moment(d.setDate(d.getDate() - 5)).format("DD/MM/YYYY");
    DbConnection.getConnected(
      // `select count(*) from (
      //   select  distinct isdn  from   sale_owner.v_VW_COMM_COMMISSION_CT7 where PAY_MONTH = to_date(:selectMonthYear,'dd/mm/rrrr')
      //   and STA_DATETIME >= to_date(:selectMonthYear,'dd/mm/rrrr')  and STA_DATETIME < to_date(:plainDate,'dd/mm/rrrr')
      //   and incentive_id ='104')`,
      // { selectMonthYear: selectMonthYear, plainDate: plainDate },
      "select * from (select sl  from sale_owner.bhtt_tbtt_ptm_hourly  order by time desc ) where rownum = 1",
      {},
      function (result) {
        console.log("result", result);

        res.send({ data: result[0][0], totalCount: result[0][0] });
      }
    );
  }

  show(req, res) {
    console.log("check");
    res.send("detail");
  }
}
module.exports = new BHTT_Controller();
