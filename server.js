const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const PORT = 5000;
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

app.listen(PORT, () => {
  console.log(`listen to post ${PORT}`);
});
