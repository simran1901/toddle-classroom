const fileModel = require("../../database/models/file");
const user = require("../../database/models/user");
const isValid = require("../isValid");

const updateFile = async (body) => {
  // check if all required keys are present
  if (
    !isValid(body.fileId) ||
    !isValid(body.userId) ||
    (!isValid(body.name) &&
      (body.description == undefined || body.description == null)) ||
    !isValid(body.classroomId)
  ) {
    return { status: 400, msg: "Incomplete data provided." };
  }

  // check if user exists and is a tutor
  const tutorExists = await user.findOne({ _id: body.userId });
  if (!tutorExists) {
    return { status: 400, msg: "user does not exist." };
  }
  if (tutorExists.type != "tutor") {
    return { status: 404, msg: "unauthorized access." };
  }

  // check if filename already exists
  if (body.name != undefined && body.name != null) {
    const fileExists = await fileModel.findOne({
      filename: body.name,
      createdInClassroom: body.classroomId,
    });

    if (fileExists) {
      return { status: 400, msg: "File with the same name already exists." };
    }
  }

  // look for file with given id and creator
  const updatedFile = await fileModel.findOne({
    _id: body.fileId,
    createdBy: body.userId,
    createdInClassroom: body.classroomId,
  });

  if (!updatedFile) {
    return {
      status: 400,
      msg: "file does not exist.",
    };
  }

  // update the file fields
  let newFile;
  try {
    newFile = await fileModel.findOneAndUpdate(
      {
        _id: body.fileId,
      },
      { $set: { filename: body.name, description: body.description } },
      { multi: false, runValidators: true }
    );
  } catch (e) {
    return {
      status: 404,
      msg: e.toString(),
    };
  }

  // return
  return { data: newFile, updated: true };
};

module.exports = updateFile;
