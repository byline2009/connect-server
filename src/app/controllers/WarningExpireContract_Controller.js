const DbConnection = require("../../DbConnection");
const excel = require("exceljs");

class WarningExpireContractController {
  index(req, res) {
    // Define the home page route

    const skip = req.query.skip;
    const limit = req.query.limit;
    const month = req.query.month;
    const year = req.query.year;
    let total = 0;
    if (skip && limit && month && year) {
      const monthFix = month < 10 ? "0" + month : month;
      const selectMonthYear = "01/" + monthFix + "/" + year;

      const query = `
           SELECT t2.CONTRACT_ID, t2.AM_CODE, t2.AM_NAME, t4.product_code,t4.quantity life_cycle,t4.started_date, t4.end_date, t4.COST, t4.COST_VAT,
                  t5.CUSTOMER_ID, t5.CUSTOMER_NAME,t5.CUSTOMER_ADDRESS, t5.CUSTOMER_PHONE,t5.CUSTOMER_EMAIL, t5.TAX_CODE, t5.PROVINCE_CODE    
                        FROM MARKET_PLACE.C7_CONTRACT@marketdr t2
                        LEFT JOIN MARKET_PLACE.C7_CONTRACT_PAYMENT_PREPAID@marketdr t3 ON ( t2.CONTRACT_ID = t3.CONTRACT_ID )
                        lEFT JOIN MARKET_PLACE.C7_CONTRACT_PM_PRE_DETAIL@marketdr t4 ON ( t3.CONTRACT_PAYMENT_PREPAID_ID = t4.PAYMENT_PREPAID_ID )
                        LEFT JOIN  MARKET_PLACE.C7_CUSTOMER@marketdr t5 ON (t2.CUSTOMER_ID = t5.CUSTOMER_ID)
                        WHERE t2.DU_AN_CTKV = 0 and t2.HOPDONG_NOIBO = 0 and t2.PRODUCT_ID != '1123' 
                        and t4.product_code in (
                        'PKI_KHCN_HMM_3Y',
                        'PKI_KHDN_HMM_3Y',
                        'E_300_VB1075',
                        'TOKEN_KHDN_HMM_3N',
                        'CLOUD2-SSD_12M',
                        'TOKEN_KHDN_HMM_2Y',
                        'PKI_KHDN_GH_1Y',
                        'CLOUD1-SSD_12M',
                        'PKI_KHCN_HMM_1Y',
                        'CLOUD-IPPUBLIC_12M',
                        'mMeeting_4_1thang_VB2972_KM',
                        'PKI_KHDN_GH_3Y',
                        'TOKEN_KHDN_HMM_2N',
                        'TOKEN_KHDN_HMM_1Y',
                        'mMeeting_4_3thang_VB2972_KM',
                        'PKI_KHCN_TTC_HMM_1Y',
                        'TOKEN_KHDN_GH_2Y',
                        'TOKEN_KHCNTC_HMM_3Y',
                        'TOKEN_KHDN_HMM_3Y',
                        'mMeeting_4_3thang_VB2972_taitro',
                        'PKI_KHDN_HMM_2Y',
                        'PKI_KHCN_TTC_HMM_3Y',
                        'TOKEN_KHDN_HMM_3Y_NOIBO',
                        'CLOUD1-CPU-SSD_12M',
                        'TANG_500_HOA_DON_DIEU_KIEN_10K_HOA_DON_VB4735',
                        'TANG_500HD_MOBIFONECA_VB4286',
                        'TOKEN_KHDN_HMM_3N_NOIBO',
                        'mMeeting_1_12thang',
                        'TOKEN_KHCNTC_HMM_1Y',
                        'eContract_demo',
                        'TOKEN_KHDN_HMM_1N',
                        'TOKEN_KHDN_GH_1Y',
                        'PKI_KHDN_HMM_1Y',
                        'mMeeting_1_6thang',
                        'TOKEN_KHDN_GH_3Y',
                        'eContract_100',
                        'eContract_500',
                        'PKI_KHCN_TTC_GH_3Y'
                        ) 
                        and trunc(t4.end_date,'mm') = trunc(TO_DATE(:selectMonthYear,'dd/mm/rrrr'),'mm')
      offset :offsetbv rows fetch next :nrowsbv rows only       
     `;
      const queryCount = `SELECT count(*) count
                        FROM MARKET_PLACE.C7_CONTRACT@marketdr t2
                        LEFT JOIN MARKET_PLACE.C7_CONTRACT_PAYMENT_PREPAID@marketdr t3 ON ( t2.CONTRACT_ID = t3.CONTRACT_ID )
                        lEFT JOIN MARKET_PLACE.C7_CONTRACT_PM_PRE_DETAIL@marketdr t4 ON ( t3.CONTRACT_PAYMENT_PREPAID_ID = t4.PAYMENT_PREPAID_ID )
                        WHERE t2.DU_AN_CTKV = 0 and t2.HOPDONG_NOIBO = 0 and t2.PRODUCT_ID != '1123' 
                        and t4.product_code in (
                        'PKI_KHCN_HMM_3Y',
                        'PKI_KHDN_HMM_3Y',
                        'E_300_VB1075',
                        'TOKEN_KHDN_HMM_3N',
                        'CLOUD2-SSD_12M',
                        'TOKEN_KHDN_HMM_2Y',
                        'PKI_KHDN_GH_1Y',
                        'CLOUD1-SSD_12M',
                        'PKI_KHCN_HMM_1Y',
                        'CLOUD-IPPUBLIC_12M',
                        'PKI_KHDN_GH_3Y',
                        'TOKEN_KHDN_HMM_2N',
                        'TOKEN_KHDN_HMM_1Y',
                        'mMeeting_4_3thang_VB2972_KM',
                        'PKI_KHCN_TTC_HMM_1Y',
                        'TOKEN_KHDN_GH_2Y',
                        'TOKEN_KHCNTC_HMM_3Y',
                        'TOKEN_KHDN_HMM_3Y',
                        'PKI_KHDN_HMM_2Y',
                        'PKI_KHCN_TTC_HMM_3Y',
                        'TOKEN_KHDN_HMM_3Y_NOIBO',
                        'CLOUD1-CPU-SSD_12M',
                        'TANG_500_HOA_DON_DIEU_KIEN_10K_HOA_DON_VB4735',
                        'TANG_500HD_MOBIFONECA_VB4286',
                        'TOKEN_KHDN_HMM_3N_NOIBO',
                        'TOKEN_KHCNTC_HMM_1Y',
                        'eContract_demo',
                        'TOKEN_KHDN_HMM_1N',
                        'TOKEN_KHDN_GH_1Y',
                        'PKI_KHDN_HMM_1Y',
                        'TOKEN_KHDN_GH_3Y',
                        'eContract_100',
                        'eContract_500',
                        'PKI_KHCN_TTC_GH_3Y'
                        )  
                        and trunc(t4.end_date, 'mm') = trunc(TO_DATE(:selectMonthYear,'dd/mm/rrrr'),'mm')
      `;
      // console.log("query", queryCount);
      DbConnection.getConnected(
        queryCount,
        {
          selectMonthYear: selectMonthYear,
        },
        function (result) {
          if (result) {
            console.log("result", result);
            total = Object.assign(result[0]).COUNT;
          }
          DbConnection.getConnected(
            query,
            {
              nrowsbv: limit,
              offsetbv: skip,
              selectMonthYear: selectMonthYear,
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
        `SELECT t2.CONTRACT_ID, t2.AM_CODE, t2.AM_NAME, t4.product_code,t4.quantity life_cycle,t4.started_date, t4.end_date,add_months(t4.started_date, t4. quantity) expire_date, t4.COST, t4.COST_VAT
                        FROM MARKET_PLACE.C7_CONTRACT@marketdr t2
                        LEFT JOIN MARKET_PLACE.C7_CONTRACT_PAYMENT_PREPAID@marketdr t3 ON ( t2.CONTRACT_ID = t3.CONTRACT_ID )
                        lEFT JOIN MARKET_PLACE.C7_CONTRACT_PM_PRE_DETAIL@marketdr t4 ON ( t3.CONTRACT_PAYMENT_PREPAID_ID = t4.PAYMENT_PREPAID_ID ) offset 0 rows fetch next 5 rows only`,
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
    const month = req.query.month;
    const year = req.query.year;
    const isCurrentPage = req.query.isCurrentPage;
    var paramsQuery;
    var query;
    const monthFix = month < 10 ? "0" + month : month;
    const selectMonthYear = "01/" + monthFix + "/" + year;
    if (isCurrentPage == true) {
      paramsQuery = {
        nrowsbv: limit,
        offsetbv: skip,
        selectMonthYear: selectMonthYear,
      };
      query = `
       SELECT t2.CONTRACT_ID, t2.AM_CODE, t2.AM_NAME, t4.product_code,t4.quantity life_cycle,t4.started_date, t4.end_date, t4.COST, t4.COST_VAT,
                  t5.CUSTOMER_ID, t5.CUSTOMER_NAME,t5.CUSTOMER_ADDRESS, t5.CUSTOMER_PHONE,t5.CUSTOMER_EMAIL, t5.TAX_CODE, t5.PROVINCE_CODE    
                        FROM MARKET_PLACE.C7_CONTRACT@marketdr t2
                        LEFT JOIN MARKET_PLACE.C7_CONTRACT_PAYMENT_PREPAID@marketdr t3 ON ( t2.CONTRACT_ID = t3.CONTRACT_ID )
                        lEFT JOIN MARKET_PLACE.C7_CONTRACT_PM_PRE_DETAIL@marketdr t4 ON ( t3.CONTRACT_PAYMENT_PREPAID_ID = t4.PAYMENT_PREPAID_ID )
                        LEFT JOIN  MARKET_PLACE.C7_CUSTOMER@marketdr t5 ON (t2.CUSTOMER_ID = t5.CUSTOMER_ID)
                        WHERE t2.DU_AN_CTKV = 0 and t2.HOPDONG_NOIBO = 0 and t2.PRODUCT_ID != '1123' 
                        and t4.product_code in (
                        'PKI_KHCN_HMM_3Y',
                        'PKI_KHDN_HMM_3Y',
                        'E_300_VB1075',
                        'TOKEN_KHDN_HMM_3N',
                        'CLOUD2-SSD_12M',
                        'TOKEN_KHDN_HMM_2Y',
                        'PKI_KHDN_GH_1Y',
                        'CLOUD1-SSD_12M',
                        'PKI_KHCN_HMM_1Y',
                        'CLOUD-IPPUBLIC_12M',
                        'mMeeting_4_1thang_VB2972_KM',
                        'PKI_KHDN_GH_3Y',
                        'TOKEN_KHDN_HMM_2N',
                        'TOKEN_KHDN_HMM_1Y',
                        'mMeeting_4_3thang_VB2972_KM',
                        'PKI_KHCN_TTC_HMM_1Y',
                        'TOKEN_KHDN_GH_2Y',
                        'TOKEN_KHCNTC_HMM_3Y',
                        'TOKEN_KHDN_HMM_3Y',
                        'mMeeting_4_3thang_VB2972_taitro',
                        'PKI_KHDN_HMM_2Y',
                        'PKI_KHCN_TTC_HMM_3Y',
                        'TOKEN_KHDN_HMM_3Y_NOIBO',
                        'CLOUD1-CPU-SSD_12M',
                        'TANG_500_HOA_DON_DIEU_KIEN_10K_HOA_DON_VB4735',
                        'TANG_500HD_MOBIFONECA_VB4286',
                        'TOKEN_KHDN_HMM_3N_NOIBO',
                        'mMeeting_1_12thang',
                        'TOKEN_KHCNTC_HMM_1Y',
                        'eContract_demo',
                        'TOKEN_KHDN_HMM_1N',
                        'TOKEN_KHDN_GH_1Y',
                        'PKI_KHDN_HMM_1Y',
                        'mMeeting_1_6thang',
                        'TOKEN_KHDN_GH_3Y',
                        'eContract_100',
                        'eContract_500',
                        'PKI_KHCN_TTC_GH_3Y'
                        ) 
                        and trunc(t4.end_date,'mm') = trunc(TO_DATE(:selectMonthYear,'dd/mm/rrrr'),'mm')
      offset :offsetbv rows fetch next :nrowsbv rows only 
      `;
    } else {
      paramsQuery = {
        selectMonthYear: selectMonthYear,
      };
      query = `
       SELECT t2.CONTRACT_ID, t2.AM_CODE, t2.AM_NAME, t4.product_code,t4.quantity life_cycle,t4.started_date, t4.end_date, t4.COST, t4.COST_VAT,
                  t5.CUSTOMER_ID, t5.CUSTOMER_NAME,t5.CUSTOMER_ADDRESS, t5.CUSTOMER_PHONE,t5.CUSTOMER_EMAIL, t5.TAX_CODE, t5.PROVINCE_CODE    
                        FROM MARKET_PLACE.C7_CONTRACT@marketdr t2
                        LEFT JOIN MARKET_PLACE.C7_CONTRACT_PAYMENT_PREPAID@marketdr t3 ON ( t2.CONTRACT_ID = t3.CONTRACT_ID )
                        lEFT JOIN MARKET_PLACE.C7_CONTRACT_PM_PRE_DETAIL@marketdr t4 ON ( t3.CONTRACT_PAYMENT_PREPAID_ID = t4.PAYMENT_PREPAID_ID )
                        LEFT JOIN  MARKET_PLACE.C7_CUSTOMER@marketdr t5 ON (t2.CUSTOMER_ID = t5.CUSTOMER_ID)
                        WHERE t2.DU_AN_CTKV = 0 and t2.HOPDONG_NOIBO = 0 and t2.PRODUCT_ID != '1123' 
                        and t4.product_code in (
                        'PKI_KHCN_HMM_3Y',
                        'PKI_KHDN_HMM_3Y',
                        'E_300_VB1075',
                        'TOKEN_KHDN_HMM_3N',
                        'CLOUD2-SSD_12M',
                        'TOKEN_KHDN_HMM_2Y',
                        'PKI_KHDN_GH_1Y',
                        'CLOUD1-SSD_12M',
                        'PKI_KHCN_HMM_1Y',
                        'CLOUD-IPPUBLIC_12M',
                        'mMeeting_4_1thang_VB2972_KM',
                        'PKI_KHDN_GH_3Y',
                        'TOKEN_KHDN_HMM_2N',
                        'TOKEN_KHDN_HMM_1Y',
                        'mMeeting_4_3thang_VB2972_KM',
                        'PKI_KHCN_TTC_HMM_1Y',
                        'TOKEN_KHDN_GH_2Y',
                        'TOKEN_KHCNTC_HMM_3Y',
                        'TOKEN_KHDN_HMM_3Y',
                        'mMeeting_4_3thang_VB2972_taitro',
                        'PKI_KHDN_HMM_2Y',
                        'PKI_KHCN_TTC_HMM_3Y',
                        'TOKEN_KHDN_HMM_3Y_NOIBO',
                        'CLOUD1-CPU-SSD_12M',
                        'TANG_500_HOA_DON_DIEU_KIEN_10K_HOA_DON_VB4735',
                        'TANG_500HD_MOBIFONECA_VB4286',
                        'TOKEN_KHDN_HMM_3N_NOIBO',
                        'mMeeting_1_12thang',
                        'TOKEN_KHCNTC_HMM_1Y',
                        'eContract_demo',
                        'TOKEN_KHDN_HMM_1N',
                        'TOKEN_KHDN_GH_1Y',
                        'PKI_KHDN_HMM_1Y',
                        'mMeeting_1_6thang',
                        'TOKEN_KHDN_GH_3Y',
                        'eContract_100',
                        'eContract_500',
                        'PKI_KHCN_TTC_GH_3Y'
                        ) 
                        and trunc(t4.end_date,'mm') = trunc(TO_DATE(:selectMonthYear,'dd/mm/rrrr'),'mm')      `;
    }
    DbConnection.getConnected(query, paramsQuery, function (data) {
      if (data) {
        var workbook = new excel.Workbook();
        const arrTemp = [];
        data.map((item, index) => {
          const object = {
            contractId: item.CONTRACT_ID,
            amCode: item.AM_CODE,
            amName: item.AM_NAME,
            productCode: item.PRODUCT_CODE,
            lifeCycle: item.LIFE_CYCLE,
            startedDate: item.STARTED_DATE,
            endDate: item.END_DATE,
            cost: item.COST,
            costVAT: item.COST_VAT,
            customerName: item.CUSTOMER_NAME,
            customerPhone: item.CUSTOMER_PHONE,
            customerEmail: item.CUSTOMER_EMAIL,
            customerAddress: item.CUSTOMER_ADDRESS,
          };
          arrTemp.push(object);
        });
        let worksheet = workbook.addWorksheet("Thay_sim_4G"); //creating worksheet
        worksheet.columns = [
          { header: "Contract_Id", key: "contractId", width: 10 },
          { header: "Am_Code", key: "amCode", width: 30 },
          { header: "Am_Name", key: "amName", width: 30 },
          { header: "productCode", key: "productCode", width: 30 },
          { header: "Quantity", key: "lifeCycle", width: 20 },
          {
            header: "Started_Date",
            key: "startedDate",
            width: 30,
          },
          {
            header: "End_Date",
            key: "endDate",
            width: 30,
          },
          { header: "Customer_Name", key: "customerName", width: 30 },
          { header: "Customer_Phone", key: "customerPhone", width: 10 },
          { header: "Customer_Email", key: "customerEmail", width: 30 },
          { header: "Customer_Address", key: "customerAddress", width: 150 },
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

module.exports = new WarningExpireContractController();
