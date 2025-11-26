const express = require("express")
const { isLoggedIn } = require("../Middleware/isLoggedIn");
const { isAuthor } = require("../Middleware/isAuthor");
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

router.get("/posts", isLoggedIn, async( req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const foundPost = await Post.find({author: loggedInUserId})
        res.status(200).json({msg: "done", data: foundPost})
    } catch (error) {
        res.status(401).json({error: error.message})
    }
})

router.get("/posts/:id", isLoggedIn, isAuthor , async(req, res) => {
    try {

        const foundPost = await Post.findById(req.params.id)
        res.status(200).json({msg: "done", data: foundPost})
    } catch (error) {
        res.status(401).json({error: error.message})
    }
})
 
module.exports = { 
    postRouter: router,
}  