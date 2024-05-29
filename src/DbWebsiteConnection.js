var async = require("async");

const oracledb = require("oracledb");
oracledb.autoCommit = true;
require("dotenv").config();
var getConnected = function (sql, params, callback) {
  // const res = await execute();
  //     callback(res);
  // oracledb.createPool(
  //   {
  //     user: process.env.USER_WEBSITE,
  //     password: process.env.PASSWORD_WEBSITE,
  //     connectString: process.env.CONNECT_STRING_WEBSITE,
  //   },
  //   async function (err, pool) {
  //     if (err) {
  //       console.error(err.message);
  //       callback(null);
  //       return;
  //     }
  //     // doit(pool, callback);
  //     // connection.execute(
  //     //   sql,
  //     //   params,
  //     //   {
  //     //     f_resul: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
  //     //   },
  //     //   function (err, result) {
  //     //     if (err) {
  //     //       console.error(err.message);
  //     //       doRelease(connection);
  //     //       callback(null);
  //     //       return;
  //     //     }
  //     //     console.log("result.outBinds", result);
  //     //     res = result.outBinds;
  //     //     doRelease(connection);
  //     //     callback(res);
  //     //     return;
  //     //   }
  //     // );
  //   }
  // );
  // var doit = function (pool, callback) {
  //   async.waterfall(
  //     [
  //       function (cb) {
  //         pool.getConnection(cb);
  //       },
  //       // Tell the DB to buffer DBMS_OUTPUT
  //       enableDbmsOutput,
  //       createDbmsOutput,
  //       fetchDbmsOutputLine,
  //     ],
  //     function (err, result) {
  //       // console.log("result", err, result);
  //       if (err) {
  //         console.error("In waterfall error cb: ==>", err, "<==");
  //       }
  //       callback(result);
  //     }
  //   );
  // };
  // var enableDbmsOutput = function (conn, cb) {
  //   conn.execute("begin dbms_output.enable(null); end;", function (err) {
  //     return cb(err, conn);
  //   });
  // };
  // var createDbmsOutput = function (conn, cb) {
  //   conn.execute(
  //     `declare
  //     f_resul CLOB;
  //     begin
  //     f_resul := F_call_soap_api_flowone(777555565);
  //     end;`,
  //     function (err) {
  //       return cb(err, conn);
  //     }
  //   );
  // };
  // var fetchDbmsOutputLine = function (conn, cb) {
  //   conn.execute(
  //     "begin dbms_output.get_line(:ln, :st); end;",
  //     {
  //       ln: {
  //         dir: oracledb.BIND_OUT,
  //         type: oracledb.STRING,
  //         maxSize: 32767,
  //       },
  //       st: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
  //     },
  //     function (err, result) {
  //       if (err) {
  //         return cb(err, conn);
  //       } else if (result.outBinds.st == 1) {
  //         return cb(null, conn); // no more output
  //       } else {
  //         console.log("fetchDbmsOutputLine", result.outBinds);
  //         // return fetchDbmsOutputLine(conn, cb);
  //         // conn.release(function (err) {
  //         //   if (err) console.error(err.message);
  //         // });
  //         return cb(null, result.outBinds.ln);
  //       }
  //     }
  //   );
  // };
};

async function execute(isdn) {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.USER_WEBSITE,
      password: process.env.PASSWORD_WEBSITE,
      connectString: process.env.CONNECT_STRING_WEBSITE,
    });
    // Khai báo biến để nhận kết quả trả về từ function
    let bindvars = {
      result: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 32767 },
    };
    console.log(connection);
    const result = await connection.execute(
      `BEGIN :result := F_call_soap_api_flowone(${isdn}); END;`,
      bindvars
    );
    console.log("Result:", result);
    return result.outBinds.result;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

module.exports.getConnected = getConnected;
module.exports.execute = execute;
