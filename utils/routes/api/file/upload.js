const express = require("express");
const router = express.Router();
const uploadFile = require("../../../controller/file/uploadFile");

router.post("/", async (req, res) => {
  res.send(await uploadFile(req));
});

module.exports = router;
