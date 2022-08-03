const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../controller/auth/authMiddleware");

router.use("/upload", authMiddleware, require("./upload"));
router.use("/update", authMiddleware, require("./update"));
router.use("/delete", authMiddleware, require("./delete"));
router.use("/getFiles", authMiddleware, require("./getFiles"));
router.use("/getFile", authMiddleware, require("./getFile"));

module.exports = router;
