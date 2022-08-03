const classroom = require("../../database/models/classroom");
const user = require("../../database/models/user");
const jwt = require("jsonwebtoken");
const isValid = require("../isValid");

const addStudent = async (body) => {
  // add student with student id to classroom with id classroomId by tutor with tutorId

  // check if all required keys are present
  if (
    !isValid(body.tutorId) ||
    !isValid(body.classroomId) ||
    !isValid(body.studentId)
  ) {
    return { status: 400, msg: "Incomplete data provided." };
  }

  // check if tutorId is valid
  const tutorExists = await user.findOne({ _id: body.tutorId, type: "tutor" });
  if (!tutorExists) {
    return {
      status: 400,
      msg: "tutor does not exist.",
    };
  }

  // check if the classroom has been created by tutor
  const classCheck = await classroom.findOne({
    _id: body.classroomId,
    createdBy: body.tutorId,
  });
  if (!classCheck) {
    return {
      status: 400,
      msg: "classroom does not exist.",
    };
  }

  // check for already added student
  const studentsList = await classCheck.students;
  const studentExists = studentsList.find(function (element) {
    return element == body.studentId;
  });
  if (studentExists)
    return { status: 400, msg: "student is already added to class." };

  try {
    // add student
    await classroom.findOneAndUpdate(
      {
        _id: body.classroomId,
        createdBy: body.tutorId,
      },
      {
        $push: {
          students: body.studentId,
        },
      },
      { new: true, upsert: true }
    );
  } catch (e) {
    return { status: 400, msg: e.toString() };
  }

  // return
  return {
    data: {
      tutorId: body.tutorId,
      studentId: body.studentId,
      classroomId: body.classroomId,
    },
    studentAdded: true,
  };
};

module.exports = addStudent;
