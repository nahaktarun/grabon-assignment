const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/index");
const cors = require("cors");
const app = express();

const PORT = 3002;
const prepareAndStartServer = () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use("/api", apiRoutes);
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
};

prepareAndStartServer();
