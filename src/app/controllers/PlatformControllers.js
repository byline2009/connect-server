const DbConnection = require("../../DbConnection");
const excel = require("exceljs");

class PlatformController {
  index(req, res) {
    // Define the home page route
    res.send({ result: "Hello World" });
  }
  async getFileExcel(req, res) {
    // Define the home page route
    const skip = req.query.skip;
    const limit = req.query.limit;
    const isCurrentPage = req.query.isCurrentPage;
    const month = req.query.month;
    if (skip && limit && isCurrentPage) {
      var paramsQuery;
      var query = "";
      const resultProcedure =
        await DbConnection.executeProcedurePlatFomMonthly();
      if (resultProcedure !== null) {
        if (isCurrentPage === "true") {
          query = `select FILE_DATE, ISSUE_DATE, LOAITB, ISDN, SUB_ID, SUB_TYPE, CUS_TYPE, ACTIVE_DATE, SHOP_CODE, 
	      GOI_CUOC_DAU, PLATFORM, CHARGE_PRICE, REG_DATETIME, PROVINCE_DKY_GOI, NUM_OF_CYCLES, NUM_DAYS_PER_CYCLES, VLR_PROVINCE, VLR_DISTRICT, DTHU_MONTH, PROVINCE_PHAT_TRIEN_TB
        from AN_OWNER.DU_LIEU_TB_PLATFORM_PTM 
         where TRUNC(ISSUE_DATE, 'MONTH') = to_date(:nmonth, 'dd-mm-rrrr') offset :offsetbv rows fetch next :nrowsbv rows only`;
          paramsQuery = {
            offsetbv: skip,
            nrowsbv: limit,
            nmonth: month,
          };
        } else {
          query = `select FILE_DATE, ISSUE_DATE, LOAITB, ISDN, SUB_ID, SUB_TYPE, CUS_TYPE, ACTIVE_DATE, SHOP_CODE, 
	      GOI_CUOC_DAU, PLATFORM, CHARGE_PRICE, REG_DATETIME, PROVINCE_DKY_GOI, NUM_OF_CYCLES, NUM_DAYS_PER_CYCLES, VLR_PROVINCE, VLR_DISTRICT, DTHU_MONTH, PROVINCE_PHAT_TRIEN_TB
        from AN_OWNER.DU_LIEU_TB_PLATFORM_PTM 
         where TRUNC(ISSUE_DATE, 'MONTH') = to_date(:nmonth, 'dd-mm-rrrr')`;

          paramsQuery = {
            nmonth: month,
          };
        }

        DbConnection.getConnected(query, paramsQuery, function (data) {
          if (data) {
            var workbook = new excel.Workbook();
            const arrTemp = [];
            data.map((item, index) => {
              const object = {
                FILE_DATE: item.FILE_DATE,
                ISSUE_DATE: item.ISSUE_DATE,
                LOAITB: item.LOAITB,
                ISDN: item.ISDN,
                SUB_ID: item.SUB_ID,
                SUB_TYPE: item.SUB_TYPE,
                CUS_TYPE: item.CUS_TYPE,
                ACTIVE_DATE: item.ACTIVE_DATE,
                SHOP_CODE: item.SHOP_CODE,
                GOI_CUOC_DAU: item.GOI_CUOC_DAU,
                PLATFORM: item.PLATFORM,
                CHARGE_PRICE: item.CHARGE_PRICE,
                REG_DATETIME: item.REG_DATETIME,
                PROVINCE_DKY_GOI: item.PROVINCE_DKY_GOI,
                NUM_OF_CYCLES: item.NUM_OF_CYCLES,
                NUM_DAYS_PER_CYCLES: item.NUM_DAYS_PER_CYCLES,
                VLR_PROVINCE: item.VLR_PROVINCE,
                VLR_DISTRICT: item.VLR_DISTRICT,
                DTHU_MONTH: item.DTHU_MONTH,
                PROVINCE_PHAT_TRIEN_TB: item.PROVINCE_PHAT_TRIEN_TB,
              };
              arrTemp.push(object);
            });
            let worksheet = workbook.addWorksheet("Employees"); //creating worksheet
            worksheet.columns = [
              { header: "FILE_DATE", key: "FILE_DATE", width: 10 },
              { header: "ISSUE_DATE", key: "ISSUE_DATE", width: 30 },
              { header: "LOAITB", key: "LOAITB", width: 30 },
              {
                header: "ISDN",
                key: "ISDN",
                width: 10,
              },
              { header: "SUB_ID", key: "SUB_ID", width: 30 },
              { header: "SUB_TYPE", key: "SUB_TYPE", width: 30 },
              { header: "CUS_TYPE", key: "CUS_TYPE", width: 30 },

              { header: "ACTIVE_DATE", key: "ACTIVE_DATE", width: 30 },
              { header: "SHOP_CODE", key: "SHOP_CODE", width: 30 },
              { header: "GOI_CUOC_DAU", key: "GOI_CUOC_DAU", width: 30 },

              { header: "PLATFORM", key: "PLATFORM", width: 30 },
              { header: "CHARGE_PRICE", key: "CHARGE_PRICE", width: 30 },
              { header: "REG_DATETIME", key: "REG_DATETIME", width: 30 },

              {
                header: "PROVINCE_DKY_GOI",
                key: "PROVINCE_DKY_GOI",
                width: 30,
              },
              { header: "NUM_OF_CYCLES", key: "NUM_OF_CYCLES", width: 30 },
              {
                header: "NUM_DAYS_PER_CYCLES",
                key: "NUM_DAYS_PER_CYCLES",
                width: 30,
              },

              { header: "VLR_PROVINCE", key: "VLR_PROVINCE", width: 30 },
              { header: "VLR_DISTRICT", key: "VLR_DISTRICT", width: 30 },
              { header: "DTHU_MONTH", key: "DTHU_MONTH", width: 30 },
              {
                header: "PROVINCE_PHAT_TRIEN_TB",
                key: "PROVINCE_PHAT_TRIEN_TB",
                width: 30,
              },
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
  }
  show(req, res) {
    console.log("check");
    res.send("detail");
  }
}
module.exports = new PlatformController();
