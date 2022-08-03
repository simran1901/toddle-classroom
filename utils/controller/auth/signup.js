const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../../database/models/user");
const isValid = require("../isValid");

const signup = async (body) => {
  // any data not provided
  if (
    !isValid(Object.keys(body)) ||
    !isValid(body.email) ||
    !isValid(body.password) ||
    !body.type
  ) {
    console.log(body);
    return { status: 404, msg: "user details incomplete!" };
  }

  // if email already exists
  const userExists = await user.find({ username: body.email });
  if (userExists.length > 0)
    return {
      status: 409,
      msg: "username already exists! Try another username",
    };

  // if type gets unrecognized value
  if (body.type !== "student" && body.type !== "tutor")
    return { status: 400, msg: "Bad Request!" };

  // create a hash of password
  const passwordHash = await bcrypt.hash(body.password, 10);
  const newUserObj = {
    username: body.email,
    password: passwordHash,
    type: body.type,
  };
  // save user
  let newUser;
  try {
    newUser = await new user(newUserObj).save();
  } catch (e) {
    return {
      status: 400,
      msg: e.toString(),
    };
  }

  // create jwt token
  const tokenObj = {
    id: newUser._id,
    username: newUser["username"],
    type: newUser["type"],
  };

  const token = jwt.sign(tokenObj, process.env.TOKEN_KEY, {
    // expiresIn: "30s",
  });
  // return result
  return {
    status: 200,
    data: { ...tokenObj, token },
  };
};

module.exports = signup;
