const DbConnection = require("../../DbSaleOwnerConnection");
const excel = require("exceljs");

class EmployeeOffController {
  index(req, res) {
    // Define the home page route
    const skip = req.query.skip;
    const limit = req.query.limit;
    let total = 0;

    DbConnection.getConnected(
      "SELECT count(*) FROM sale_owner.NHAN_VIEN_NGHI_VIEC",
      {},
      function (result) {
        total = result[0][0];
        if (skip && limit) {
          DbConnection.getConnected(
            "SELECT * FROM sale_owner.NHAN_VIEN_NGHI_VIEC offset :offsetbv rows fetch next :nrowsbv rows only",
            { nrowsbv: limit, offsetbv: skip },
            function (data) {
              if (data) {
                data.map((item, index) => {});
              }
              console.log("data", JSON.stringify(data));
              res.send({ data: data, totalCount: total });
            }
          );
        } else {
          DbConnection.getConnected(
            "SELECT * FROM sale_owner.NHAN_VIEN_NGHI_VIEC offset 0 rows fetch next 5 rows only",
            {},
            function (data) {
              res.send({ data: data, totalCount: total });
            }
          );
        }
      }
    );
  }
  getFileExcel(req, res) {
    // Define the home page route
    const skip = req.query.skip;
    const limit = req.query.limit;
    const isCurrentPage = req.query.isCurrentPage;
    if (skip && limit && isCurrentPage) {
      var paramsQuery;
      var query = "";
      if (isCurrentPage === "true") {
        query =
          "SELECT * FROM sale_owner.NHAN_VIEN_NGHI_VIEC offset :offsetbv rows fetch next :nrowsbv rows only";
        paramsQuery = {
          offsetbv: skip,
          nrowsbv: limit,
        };
      } else {
        query = "SELECT * FROM sale_owner.NHAN_VIEN_NGHI_VIEC ";

        paramsQuery = {};
      }
      console.log("check", skip, limit, isCurrentPage, query);

      DbConnection.getConnected(query, paramsQuery, function (data) {
        if (data) {
          var workbook = new excel.Workbook();
          const arrTemp = [];
          data.map((item, index) => {
            const object = {
              tinh: item[0],
              shop_code: item[1],
              shop_name: item[2],
              emp_code: item[3],
              emp_name: item[4],
              area_code: item[5],
              description: item[6],
            };
            arrTemp.push(object);
          });
          let worksheet = workbook.addWorksheet("Employees"); //creating worksheet
          worksheet.columns = [
            { header: "Tinh", key: "tinh", width: 10 },
            { header: "Shop_Code", key: "shop_code", width: 30 },
            { header: "Shop_Name", key: "shop_name", width: 30 },
            {
              header: "Emp_Code",
              key: "emp_code",
              width: 10,
              outlineLevel: 1,
            },
            { header: "Emp_Name", key: "emp_name", width: 30 },
            { header: "Area_code", key: "area_code", width: 30 },
            { header: "Description", key: "description", width: 100 },
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
  }
  show(req, res) {
    console.log("check");
    res.send("detail");
  }
}
module.exports = new EmployeeOffController();
