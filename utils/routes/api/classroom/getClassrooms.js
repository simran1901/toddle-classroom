const express = require("express");
const router = express.Router();
const getClassrooms = require("../../../controller/classroom/getClassrooms");

router.get("/", async (req, res) => {
  res.send(await getClassrooms(req.body));
});

module.exports = router;
