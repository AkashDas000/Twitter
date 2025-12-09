const express = require("express");
const { isLoggedIn } = require("../Middleware/isLoggedIn");
const { isAuthor } = require("../Middleware/isAuthor");
const { Comment } = require("../Models/Comment");
const { Post } = require("../Models/Post");

const router = express.Router();

router.post("/comment/:id", isLoggedIn, async (req, res) => {
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

router.post("/comment/:commentId/:postId", isLoggedIn, async( req, res) => {
  try {
    const {commentId, postId} = req.params
    const foundComment = await Comment.findById(commentId)
    const foundPost = await Post.findById(postId)

    let isEligibleToDelete = foundComment.author.toString() == req.user._id.toString()
    || foundPost.author.toString() == req.user._id.toString()

    if(!isEligibleToDelete){
      throw new Error("Access Denied")
    }

    const filteredCommet = foundPost.comment.filter((item) => {
      return item.toString() != commentId
     })

     foundPost.comment = filteredCommet
     await foundPost.save()
     await Comment.findByIdAndDelete(commentId)

     res.status(200).json({msg: "done"})

  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

module.exports = {
  commentRouter: router,
};
