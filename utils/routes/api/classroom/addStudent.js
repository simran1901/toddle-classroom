const express = require("express");
const router = express.Router();
const addStudent = require("../../../controller/classroom/addStudent");

router.post("/", async (req, res) => {
  res.send(await addStudent(req.body));
});

module.exports = router;
