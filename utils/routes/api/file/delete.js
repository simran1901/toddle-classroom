const express = require("express");
const router = express.Router();
const deleteFile = require("../../../controller/file/deleteFile");

router.delete("/", async (req, res) => {
  res.send(await deleteFile(req.body));
});

module.exports = router;
