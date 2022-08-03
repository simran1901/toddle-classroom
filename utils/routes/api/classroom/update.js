const express = require("express");
const router = express.Router();
const updateClassroom = require("../../../controller/classroom/updateClassroom");

router.patch("/", async (req, res) => {
  res.send(await updateClassroom(req.body));
});

module.exports = router;
