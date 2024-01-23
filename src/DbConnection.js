const oracledb = require("oracledb");
oracledb.autoCommit = true;
require("dotenv").config();

var getConnected = function (sql, params, callback) {
  oracledb.getConnection(
    {
      user: process.env.USER_AN,
      password: process.env.PASSWORD_AN,
      connectString: process.env.CONNECT_STRING_AN,
    },
    function (err, connection) {
      if (err) {
        console.error(err.message);
        callback(null);
        return;
      }
      connection.execute(
        sql,
        params,
        {
          outFormat: oracledb.OBJECT,
        },
        function (err, result) {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            callback(null);
            return;
          }
          console.log(result.metaData);
          //console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
          //console.log(result.rows);     // [ [ 180, 'Construction' ] ]
          //module.exports.rows  = result.rows;
          rows = result.rows;
          doRelease(connection);
          callback(rows);
          return;
        }
      );
    }
  );
};

async function execute(sql, params) {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.USER_AN,
      password: process.env.PASSWORD_AN,
      connectString: process.env.CONNECT_STRING_AN,
    });

    let queryResult;
    queryResult = await connection.execute(sql, params, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    return queryResult.rows;
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

function doRelease(connection) {
  connection.close(function (err) {
    if (err) {
      console.error(err.message);
    }
  });
}
module.exports.getConnected = getConnected;
module.exports.execute = execute;
