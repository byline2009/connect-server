require("dotenv").config();
const jwt = require("jsonwebtoken");

const DbConnection = require("../DbConnection");
const employeeOffRouter = require("./EmployeeOff");
const dashboardRouter = require("./DashBoard");
const thaySim4GRouter = require("./Thaysim4G");
const ptm_nvbh_tbtt_Router = require("./PTM_NVBH_TBTT");
const bhtt_ptm_Router = require("./BHTT");
const db01_ptm_Router = require("./DB01-PTM");
const warning_Expire_contract_Router = require("./Warning_Contract");
const authenticateRouter = require("./Authenticate");
const websiteRouter = require("./Website");

function route(app) {
  app.get("/", function (req, res) {
    res.send("Hello World!"); // This will serve your request to '/'.
  });
  app.post("/login", authenticateRouter);
  app.use("/nhan-vien-nghi-viec", authenticateToken, employeeOffRouter);
  app.use("/thay-sim-4g", authenticateToken, thaySim4GRouter);
  app.use("/ptm-nvbh-tbtt", authenticateToken, ptm_nvbh_tbtt_Router);
  app.use("/bhtt-ptm", authenticateToken, bhtt_ptm_Router);
  app.use("/db01-ptm", authenticateToken, db01_ptm_Router);
  app.use("/dashboard", authenticateToken, dashboardRouter);
  app.use(
    "/warning-contract",
    authenticateToken,
    warning_Expire_contract_Router
  );
  app.use("/website", websiteRouter);
}
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
module.exports = route;
