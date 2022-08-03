const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/classroom", require("./classroom"));
router.use("/file", require("./file"));

module.exports = router;
