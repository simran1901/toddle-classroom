const express = require("express");
const router = express.Router();
const getFiles = require("../../../controller/file/getFiles");

router.get("/", async (req, res) => {
  res.send(await getFiles(req));
});

module.exports = router;
