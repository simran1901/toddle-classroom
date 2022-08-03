const mongoose = require("mongoose");
const schema = mongoose.Schema;

const fileSchema = schema({
  name: String,
  filename: String,
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: schema.Types.ObjectId,
    ref: "users",
  },
  createdInClassroom: {
    type: schema.Types.ObjectId,
    ref: "classrooms",
  },
  fileType: String, // AUDIO, VIDEO, IMAGE, URL
  details: {
    data: Buffer,
    contentType: String,
    encoding: String,
  },
});

const file = mongoose.model("files", fileSchema);

module.exports = file;
