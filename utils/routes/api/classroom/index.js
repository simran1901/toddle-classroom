const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../controller/auth/authMiddleware");

router.use("/create", authMiddleware, require("./create"));
router.use("/update", authMiddleware, require("./update"));
router.use("/delete", authMiddleware, require("./delete"));
router.use("/addStudent", authMiddleware, require("./addStudent"));
router.use("/getClassrooms", authMiddleware, require("./getClassrooms"));

module.exports = router;
