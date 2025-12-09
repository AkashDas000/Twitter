const express = require("express");
const { isLoggedIn } = require("../Middleware/isLoggedIn");
const { isAuthor } = require("../Middleware/isAuthor");
const { Comment } = require("../Models/Comment");
const { Post } = require("../Models/Post");

const router = express.Router();

router.post("/posts/comment/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const foundPost = await Post.findById(id);
    if (!foundPost) {
      throw new Error("Post Not Found / Post Does Not Exist");
    }
    const newComment = await Comment.create({ text, author: req.user._id });

    foundPost.comment.push(newComment);
    await foundPost.save();

    res.status(201).json({ msg: "done" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  commentRouter: router,
};
