const express = require("express")
const { isLoggedIn } = require("../Middleware/isLoggedIn");
const { Post } = require("../Models/Post");

const router = express.Router()

router.post("/posts", isLoggedIn, async(req, res) => {
    try {
        const {caption, img} = req.body;
        if( !caption && !img){
            throw new Error("Please provide either caption and image")
        }

        const createPost = await Post.create({caption, img, author: req.user._id})
        res.status(201).json({msg: "done", data: createPost})
    } catch (error) {
        res.status(400).json({error: error.message})
        
    } 
})
 
module.exports = {
    postRouter: router,
} 