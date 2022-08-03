require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

const mongooseDB = require("./utils/database/config");

// setting up express
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

// setting up routes
app.use("/", require("./utils/routes"));

// listening at port
app.listen(port, () => {
  console.log(`listening at port ${port}`);
});

mongooseDB.open();
