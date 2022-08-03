const classroom = require("../../database/models/classroom");
const user = require("../../database/models/user");
const jwt = require("jsonwebtoken");
const isValid = require("../isValid");

const updateClassroom = async (body) => {
  // check if all required keys are present
  if (!isValid(body.id) || !isValid(body.createdBy) || !isValid(body.name)) {
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
      msg: "classroom with the same name already exists.",
    };
  }

  // look for classroom with given id and creator
  const updatedClassroom = classroom.findOne({
    _id: body.id,
    createdBy: body.createdBy,
  });

  if (!updatedClassroom) {
    return {
      status: 400,
      msg: "classroom does not exist.",
    };
  }

  // update the classroom fields
  let newClassroom;
  try {
    newClassroom = await classroom.findOneAndUpdate(
      {
        _id: body.id,
        createdBy: body.createdBy,
      },
      { name: body.name }
    );
  } catch (e) {
    return {
      status: 404,
      msg: e.toString(),
    };
  }

  // return
  return {
    data: newClassroom,
    updated: true,
  };
};

module.exports = updateClassroom;
