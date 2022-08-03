const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../../database/models/user");
const isValid = require("../isValid");

const login = async (body) => {
  // any data not provided
  if (
    !isValid(Object.keys(body)) ||
    !isValid(body.email) ||
    !isValid(body.password)
  )
    return { status: 404, msg: "user details incomplete!" };

  // if email doesn't exists
  const userFound = await user.find({ username: body.email });
  if (userFound.length === 0)
    return { status: 409, msg: "username not found! try another username" };
  else {
    // if user with email exits
    let passwordMatched = await bcrypt.compare(
      body.password,
      userFound[0].password
    );
    // if password doesn't match
    if (!passwordMatched)
      return { status: 403, msg: "Password Incorrect! Try another password" };
    else {
      // if password matches
      const tokenObj = {
        id: userFound[0]._id,
        username: userFound[0].username,
        type: userFound[0].type,
      };
      // create new token
      const token = jwt.sign(tokenObj, process.env.TOKEN_KEY, {
        // expiresIn: "5m",
      });
      // return token
      return {
        status: 200,
        data: { ...tokenObj, token },
      };
    }
  }
};

module.exports = login;
