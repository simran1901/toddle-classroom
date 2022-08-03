const classroom = require("../../database/models/classroom");
const user = require("../../database/models/user");
const jwt = require("jsonwebtoken");
const isValid = require("../isValid");

const getClassrooms = async (body) => {
  // check if all required keys are present
  if (!isValid(body.userId))
    return { status: 400, msg: "Imcomplete data provided." };

  // check if user exists and is a tutor
  const userExists = await user.findOne({ _id: body.userId });
  if (!userExists) return { status: 400, msg: "user does not exist" };
  if (userExists.type == "tutor") {
    const tutorResult = await classroom.find({ createdBy: body.userId });
    return tutorResult;
  }

  // return search result
  const studentResult = await classroom.find({
    students: body.userId,
  });
  return studentResult;
};

module.exports = getClassrooms;
