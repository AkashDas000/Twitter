const express = require("express");
const { isLoggedIn } = require("../Middleware/isLoggedIn");
const { isAuthor } = require("../Middleware/isAuthor");
const { Post } = require("../Models/Post");
const { User } = require("../Models/User");


const router = express.Router();

router.post("/posts", isLoggedIn, async (req, res) => {
  try {
    const { caption, img } = req.body;
    if (!caption && !img) {
      throw new Error("Please provide either caption and image");
    }

    const createPost = await Post.create({
      caption,
      img,
      author: req.user._id,
    });
    req.user.post.push(createPost);
    await req.user.save();
    res.status(201).json({ msg: "done", data: createPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/posts", isLoggedIn, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const foundPost = await Post.find({ author: loggedInUserId }).populate(
        [
            {
                path: "comment",
                populate: {
                    path: "author",
                    select: "firstName lastName username profilePicture"
                }
            },
            {
                path: "likes",
                select: "firstName lastName username profilePicture"
            }
        ]
    )
    res.status(200).json({ msg: "done", data: foundPost });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.get("/posts/:id", isLoggedIn, isAuthor, async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.id);
    res.status(200).json({ msg: "done", data: foundPost });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.delete("/posts/:id", isLoggedIn, isAuthor, async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.status(200).json({ msg: "done" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.patch("/posts/:id", isLoggedIn, isAuthor, async (req, res) => {
  try {
    const { caption } = req.body;
    const { id } = req.params;
    const updatePosts = await Post.findByIdAndUpdate(
      id,
      { caption },
      { new: true }
    );
    res.status(200).json({ msg: "done", data: updatePosts });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.patch("/posts/like/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const UserData = await User.findById(req.user._id);
    const postToBeLiked = await Post.findById(id);

    if(!postToBeLiked){
            throw new Error("Post Not Found / Post Does Not Exist")
        }

    const flag = postToBeLiked.likes.some((item) => {
      return item.toString() == req.user._id.toString();
    });

    if (flag) {
      throw new Error("Already Liked");
    }

    postToBeLiked.likes.push(UserData._id);
    await postToBeLiked.save();
    res.status(200).json({ msg: "done" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});



router.patch("/posts/unlike/:id", isLoggedIn, async (req, res) => {
    try {
        const {id} = req.params
        const foundPost = await Post.findById(id)

        if(!foundPost){
            throw new Error("Post Not Found / Post Does Not Exist")
        }

        const filteredArray = foundPost.likes.filter((item) => {
            return item._id.toString() !=  req.user._id.toString()
        })

        foundPost.likes = filteredArray
        await foundPost.save()

        res.status(200).json({msg: "done"})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

module.exports = {
  postRouter: router,
};
