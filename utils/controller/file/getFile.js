const user = require("../../database/models/user");
const fileModel = require("../../database/models/file");
const classroom = require("../../database/models/classroom");
const isValid = require("../isValid");

const getFile = async (req, res) => {
  // check if all required keys are present
  if (
    !isValid(req.body.userId) ||
    !isValid(req.body.classroomId) ||
    !isValid(req.body.fileId)
  )
    return { status: 400, msg: "Imcomplete data provided." };

  // check if user exists
  const userExists = await user.findOne({ _id: req.body.userId });
  if (!userExists) return { status: 400, msg: "user does not exist" };

  // check if classroom exists
  const classroomExists = await classroom.findOne({
    _id: req.body.classroomId,
  });
  if (!classroomExists)
    return { status: 400, msg: "classroom does not exist." };

  // if the classroom has been created by the user id or the id is present in students list
  if (
    classroomExists.createdBy == req.body.userId ||
    classroomExists.students.find((element) => {
      return element == req.body.userId;
    })
  ) {
    const file = await fileModel.findOne({
      _id: req.body.fileId,
      createdInClassroom: req.body.classroomId,
    });
    return file.details;
  }

  return { status: 400, msg: "unable to get file." };
};

module.exports = getFile;
