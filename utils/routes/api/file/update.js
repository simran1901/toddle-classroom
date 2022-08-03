const express = require("express");
const router = express.Router();
const updateFile = require("../../../controller/file/updateFile");

router.patch("/", async (req, res) => {
  res.send(await updateFile(req.body));
});

module.exports = router;
