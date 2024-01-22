const DbConnection = require("../../DbConnection");
const excel = require("exceljs");

class ThaySim4GController {
  index(req, res) {
    // Define the home page route

    const skip = req.query.skip;
    const limit = req.query.limit;
    const type = req.query.type;
    const month = req.query.month;
    const year = req.query.year;
    const text = req.query.textSearch;
    let total = 0;
    if (skip && limit && month && year) {
      const monthFix = month < 10 ? "0" + month : month;
      const selectMonthYear = "01/" + monthFix + "/" + year;

      const query = `SELECT isdn,  shop_code, shop_name,
         shop_type, issue_datetime,emp_code,
         emp_name, province, district_name, reason_id,
         loai_tb, thang_tt
          FROM sale_owner.CP_THAYSIM4G WHERE THANG_TT = TO_DATE(:selectMonthYear,'dd/mm/rrrr') 
            AND ISSUE_DATETIME >= TO_DATE(:selectMonthYear,'dd/mm/rrrr')
             AND DAT_DK = 'DU DK' AND shop_type IN ( :type)  ${
               text && text.length > 0
                 ? "and (isdn like :querySearch or lower(emp_code) like lower(:querySearch) or lower(emp_name) like lower(:querySearch) or lower(shop_code) like lower(:querySearch))"
                 : ""
             } offset :offsetbv rows fetch next :nrowsbv rows only`;
      const queryCount = `SELECT COUNT(*) FROM sale_owner.CP_THAYSIM4G WHERE THANG_TT = TO_DATE(:selectMonthYear,'dd/mm/rrrr') 
            AND ISSUE_DATETIME >= TO_DATE(:selectMonthYear,'dd/mm/rrrr')
             AND DAT_DK = 'DU DK' AND shop_type IN ( :type)   ${
               text && text.length > 0
                 ? "(and isdn like :querySearch  or lower(emp_code) like lower(:querySearch) or lower(emp_name) like lower(:querySearch) or lower(shop_code) like lower(:querySearch))"
                 : ""
             }`;
      console.log("query", query);
      DbConnection.getConnected(
        queryCount,
        {
          type: type,
          selectMonthYear: selectMonthYear,
          ...(text && text.length > 0
            ? { querySearch: `%` + text + `%` }
            : null),
        },
        function (result) {
          if (result) {
            total = result[0][0];
          }
          DbConnection.getConnected(
            query,
            {
              nrowsbv: limit,
              offsetbv: skip,
              type: type,
              selectMonthYear: selectMonthYear,
              ...(text && text.length > 0
                ? { querySearch: `%` + text + `%` }
                : null),
            },
            function (data) {
              if (data) {
                data.map((item, index) => {});
              }
              // console.log("data", data);
              res.send({ data: data, totalCount: total });
            }
          );
        }
      );
    } else {
      DbConnection.getConnected(
        "SELECT * FROM sale_owner.CP_THAYSIM4G offset 0 rows fetch next 5 rows only",
        {},
        function (data) {
          res.send({ data: data, totalCount: total });
        }
      );
    }
  }

  getFileExcel(req, res) {
    // Define the home page route
    const skip = req.query.skip;
    const limit = req.query.limit;
    const type = req.query.type;
    const month = req.query.month;
    const year = req.query.year;
    const text = req.query.textSearch;
    const isCurrentPage = req.query.isCurrentPage;
    var paramsQuery;
    var query;
    const monthFix = month < 10 ? "0" + month : month;
    const selectMonthYear = "01/" + monthFix + "/" + year;
    if (isCurrentPage == true) {
      paramsQuery = {
        nrowsbv: limit,
        offsetbv: skip,
        type: type,
        selectMonthYear: selectMonthYear,
        ...(text && text.length > 0 ? { querySearch: `%` + text + `%` } : null),
      };
      query = `SELECT isdn,  shop_code, shop_name,
         shop_type, issue_datetime,emp_code,
         emp_name, province, district_name, reason_id,
         loai_tb, thang_tt
          FROM sale_owner.CP_THAYSIM4G WHERE THANG_TT = TO_DATE(:selectMonthYear,'dd/mm/rrrr') 
            AND ISSUE_DATETIME >= TO_DATE(:selectMonthYear,'dd/mm/rrrr')
             AND DAT_DK = 'DU DK' AND shop_type IN ( :type)  ${
               text && text.length > 0
                 ? "and (isdn like :querySearch or lower(emp_code) like lower(:querySearch) or lower(emp_name) like lower(:querySearch) or lower(shop_code) like lower(:querySearch))"
                 : ""
             } offset :offsetbv rows fetch next :nrowsbv rows only`;
    } else {
      paramsQuery = {
        type: type,
        selectMonthYear: selectMonthYear,
        ...(text && text.length > 0 ? { querySearch: `%` + text + `%` } : null),
      };
      query = `SELECT isdn,  shop_code, shop_name,
         shop_type, issue_datetime,emp_code,
         emp_name, province, district_name, reason_id,
         loai_tb, thang_tt
          FROM sale_owner.CP_THAYSIM4G WHERE THANG_TT = TO_DATE(:selectMonthYear,'dd/mm/rrrr') 
            AND ISSUE_DATETIME >= TO_DATE(:selectMonthYear,'dd/mm/rrrr')
             AND DAT_DK = 'DU DK' AND shop_type IN ( :type)  ${
               text && text.length > 0
                 ? "and (isdn like :querySearch or lower(emp_code) like lower(:querySearch) or lower(emp_name) like lower(:querySearch) or lower(shop_code) like lower(:querySearch))"
                 : ""
             } `;
    }
    DbConnection.getConnected(query, paramsQuery, function (data) {
      if (data) {
        var workbook = new excel.Workbook();
        const arrTemp = [];
        data.map((item, index) => {
          const object = {
            isdn: item[0],
            shopCode: item[1],
            shopName: item[2],
            shopType: item[3],
            issueDateTime: item[4],
            empCode: item[5],
            empName: item[6],
            province: item[7],
            districtName: item[8],
            reasonId: item[9],
            loaiTB: item[10],
            thangtt: item[11],
          };
          arrTemp.push(object);
        });
        let worksheet = workbook.addWorksheet("Thay_sim_4G"); //creating worksheet
        worksheet.columns = [
          { header: "Isdn", key: "isdn", width: 10 },
          { header: "Shop_Code", key: "shopCode", width: 10 },
          { header: "Shop_Name", key: "shopName", width: 10 },
          { header: "Shop_Type", key: "shopType", width: 10 },
          { header: "Issue_Datetime", key: "issueDateTime", width: 20 },
          {
            header: "empCode",
            key: "empCode",
            width: 10,
            outlineLevel: 1,
          },
          { header: "Emp_Name", key: "empName", width: 30 },
          { header: "Province", key: "province", width: 10 },
          { header: "District", key: "districtName", width: 10 },
          { header: "reasonId", key: "reasonId", width: 10 },
          { header: "loaiTB", key: "loaiTB", width: 10 },
          { header: "thangtt", key: "thangtt", width: 10 },
        ];
        // Add Array Rows
        worksheet.addRows(arrTemp);
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + "Report.xlsx"
        );
        workbook.xlsx.write(res).then(function (data) {
          res.end();
          console.log("File write done........");
        });
        workbook.xlsx.write(res).then(function () {
          res.end();
        });
      }
      // res.send({ data: data, totalCount: total });
    });
  }

  show(req, res) {
    console.log("check");
    res.send("detail");
  }
}
module.exports = new ThaySim4GController();
