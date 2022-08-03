const classroom = require("../../database/models/classroom");
const user = require("../../database/models/user");
const fileModel = require("../../database/models/file");
const isValid = require("../isValid");
const file = require("../../database/models/file");

const deleteFile = async (body) => {
  // check if all required keys are present
  if (
    !isValid(body.fileId) ||
    !isValid(body.userId) ||
    !isValid(body.classroomId)
  ) {
    return { status: 404, msg: "Incomplete data provided." };
  }

  // check if user exists and is a tutor
  const tutorExists = await user.findOne({ _id: body.userId });
  if (!tutorExists) {
    return { status: 400, msg: "user does not exist." };
  }
  if (tutorExists.type != "tutor") {
    return { status: 404, msg: "unauthorized access." };
  }

  // check if file exists
  const fileExists = await fileModel.findOne({
    _id: body.fileId,
    createdBy: body.userId,
    createdInClassroom: body.classroomId,
  });
  if (!fileExists) {
    return {
      status: 400,
      msg: "file does not exist.",
    };
  }

  // delete file
  try {
    // from mongoDB
    await fileExists.deleteOne();

    // from classroom's array
    await classroom.findOneAndUpdate(
      {
        _id: body.classroomId,
        createdBy: body.userId,
      },
      {
        $pull: {
          files: body.fileId,
        },
      },
      { safe: true, upsert: true }
    );
  } catch (e) {
    return {
      status: 400,
      msg: e.toString(),
    };
  }
  fileExists.details = undefined;
  // return
  return { data: fileExists, deleted: true };
};

module.exports = deleteFile;
