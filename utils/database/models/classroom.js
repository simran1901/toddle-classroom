const mongoose = require("mongoose");
const schema = mongoose.Schema;

const classroomSchema = schema({
  name: String,
  files: {
    type: [
      {
        type: schema.Types.ObjectId,
        ref: "files",
      },
    ],
    default: [],
  },
  students: {
    type: [
      {
        type: schema.Types.ObjectId,
        ref: "users",
      },
    ],
    default: [],
  },
  createdBy: {
    type: schema.Types.ObjectId,
    ref: "users",
  },
  type: String, // student, tutor
});

const classroom = mongoose.model("classrooms", classroomSchema);

module.exports = classroom;
