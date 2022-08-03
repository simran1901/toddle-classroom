const express = require("express");
const router = express.Router();
const getFile = require("../../../controller/file/getFile");

router.get("/", async (req, res) => {
  res.send(await getFile(req, res));
});

module.exports = router;
