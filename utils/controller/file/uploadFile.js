const fileModel = require("../../database/models/file");
const user = require("../../database/models/user");
const classroom = require("../../database/models/classroom");
const isValid = require("../isValid");

const supportedFormats = ["audio", "video", "image", "url"];

const uploadFile = async (req) => {
  // check if all required keys are present
  if (
    !isValid(req.body.userId) ||
    !isValid(req.body.classroomId) ||
    !req.files
  ) {
    return {
      status: 400,
      msg: "Incomplete data provided.",
    };
  }

  if (
    !supportedFormats.find((element) => {
      return req.files.file.mimetype.split("/")[0] === element;
    })
  ) {
    return { status: 400, msg: "File type not supported" };
  }

  // check if user exists and is a tutor
  const tutorExists = await user.findOne({ _id: req.body.userId });
  if (!tutorExists) {
    return { status: 400, msg: "user does not exist." };
  }
  if (tutorExists.type != "tutor") {
    return { status: 404, msg: "unauthorized access." };
  }

  // create file object
  let newFile;
  try {
    newFile = await fileModel.create({
      name: Date.now() + "-" + req.body.userId + "-" + req.files.file.name,
      filename: req.files.file.name,
      description:
        req.body.description != null && req.body.description != undefined
          ? req.body.description
          : "",
      createdBy: req.body.userId,
      createdInClassroom: req.body.classroomId,
      fileType: req.files.file.mimetype.split("/")[0],
      details: {
        data: req.files.file.data,
        contentType: req.files.file.mimetype,
        encoding: req.files.file.encoding,
      },
    });

    // add file to classroom
    await classroom.findOneAndUpdate(
      {
        _id: req.body.classroomId,
        createdBy: req.body.userId,
      },
      {
        $push: {
          files: newFile._id,
        },
      },
      { new: true, upsert: true }
    );
  } catch (e) {
    return { status: 400, msg: e.toString() };
  }

  // return file
  return newFile;
};

module.exports = uploadFile;
