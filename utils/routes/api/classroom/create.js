const express = require("express");
const router = express.Router();
const createClassroom = require("../../../controller/classroom/createClassroom");

router.post("/", async (req, res) => {
  res.send(await createClassroom(req.body));
});

module.exports = router;
