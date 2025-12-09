const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    requied: true,
    ref: "user",
  },
  text: {
    type: String,
    trim: true,
    maxlength: 200,
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  replies: [],
});


const Comment = mongoose.model("comment", commentSchema)

module.exports = {
    Comment
}
