const express = require("express");
const router = express.Router();
const deleteClassroom = require("../../../controller/classroom/deleteClassroom");

router.delete("/", async (req, res) => {
  res.send(await deleteClassroom(req.body));
});

module.exports = router;
