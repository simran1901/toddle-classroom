const classroom = require("../../database/models/classroom");
const user = require("../../database/models/user");
const jwt = require("jsonwebtoken");
const isValid = require("../isValid");

const createClassroom = async (body) => {
  // check if all required keys are present
  if (!isValid(body.name) || !isValid(body.createdBy)) {
    return { status: 404, msg: "Incomplete data provided." };
  }

  // check if user exists and is a tutor
  const tutorExists = await user.findOne({ _id: body.createdBy });
  if (!tutorExists) {
    return { status: 400, msg: "user does not exist." };
  }
  if (tutorExists.type != "tutor") {
    return { status: 404, msg: "unauthorized access." };
  }

  // check if classroom exists
  const classExists = await classroom.find({
    name: body.name,
    createdBy: body.createdBy,
  });
  if (classExists.length > 0) {
    return {
      status: 400,
      msg: "class with the same name already exists.",
    };
  }

  // create classroom object
  const newClassroomObject = {
    name: body.name,
    createdBy: body.createdBy,
  };

  // save classroom object to db
  let newClassroom;
  try {
    newClassroom = await new classroom(newClassroomObject).save();
  } catch (e) {
    return {
      status: 400,
      msg: e.toString(),
    };
  }

  return newClassroom;
};

module.exports = createClassroom;
