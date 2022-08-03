const express = require('express');
const signup = require("../../../controller/auth/signup");
const router = express.Router();

// register user
router.post('/', async (req, res) => { res.send(await signup(req.body)) })

module.exports = router