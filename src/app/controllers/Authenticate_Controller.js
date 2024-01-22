require("dotenv").config();
const jwt = require("jsonwebtoken");
const ldap = require("ldapjs");

class Authenticate_Controller {
  index(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const user = { name: username };

    var client = ldap.createClient({
      url: "ldap://10.3.12.57:389/ou=c7,dc=mobifone,dc=vn",
      timeout: 5000,
      connectTimeout: 10000,
    });
    client.bind(username, password, (err) => {
      client.unbind();
      if (err) {
        console.log(err);
        res.sendStatus(401);
      } else {
        // var options = {
        //   filter: "(objectClass=*)",
        //   scope: "sub",
        // };
        // client.search(
        //   "cn=duong.tranvan@mobifone.vn,ou=c7,dc=mobifone,dc=vn",
        //   options,
        //   (err, res) => {
        //     if (err) {
        //       console.log(err);
        //       res.sendStatus(401);
        //     } else {
        //       // client.on("searchEntry", function (entry) {
        //       //   console.log("I found a result in searchEntry");
        //       //   console.log("entry", entry);

        //       // });

        //     }
        //   }
        // );
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "10d",
        });
        res.json({
          accessToken: accessToken,
          username: username,
        });
      }
    });
  }
}
// function authenticateDN(username, password) {
//   var client = ldap.createClient({
//     url: "ldap://10.3.12.57:389/ou=c7,dc=mobifone,dc=vn",
//     timeout: 5000,
//     connectTimeout: 10000,
//   });
//   client.bind(username, password, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("successfull");
//     }
//   });
// }
module.exports = new Authenticate_Controller();
