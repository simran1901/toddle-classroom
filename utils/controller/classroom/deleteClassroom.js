const classroom = require("../../database/models/classroom");
const user = require("../../database/models/user");
const jwt = require("jsonwebtoken");
const isValid = require("../isValid");

const deleteClassroom = async (body) => {
  // check if all required keys are present
  if (!isValid(body.id) || !isValid(body.createdBy)) {
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
  const classExists = await classroom.findOne({
    _id: body.id,
    createdBy: body.createdBy,
  });
  if (!classExists) {
    return {
      status: 400,
      msg: "class does not exist.",
    };
  }

  // delete classroom
  try {
    await classExists.deleteOne();
  } catch (e) {
    return {
      status: 400,
      msg: e.toString(),
    };
  }

  return { data: classExists, deleted: true };
};

module.exports = deleteClassroom;
