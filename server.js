

const fs = require("fs");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const https = require('https')
var certificate    = fs.readFileSync('/usr/local/ssl/certificate/tracuu7/cert_tracuu7_161024.crt');
var privateKey  = fs.readFileSync('/usr/local/ssl/certificate/tracuu7/private_tracuu7.key')

const app = express();
const PORT = 8100;
app.use(cors());
app.use(morgan("combined"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

const route = require("./src/routes");
route(app);
app.use("/public", express.static(path.join(__dirname, "public")));
https.createServer({
  key: privateKey,
  cert: certificate
}, app).listen(PORT);
// app.listen(PORT, () => {
//   console.log(`listen to post ${PORT}`);
// });
