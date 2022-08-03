const express = require("express");
const router = express.Router();
const login = require("../../../controller/auth/login");

// logging in a user
router.post("/", async (req, res) => {
  res.send(await login(req.body));
});

module.exports = router;
