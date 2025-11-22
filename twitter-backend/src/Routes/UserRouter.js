const express = require("express")
const router = express.Router()
const {User} = require("../Models/User")
const { VerifiedMail } = require("../Models/VerifiedMail")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


router.post("/signup", async (req, res) => {
    try {
        const {firstName, lastName, username, mail, password, dateofBirth} = req.body

        const foundUser = await User.findOne({
            $or: [
                {username},
                {mail}
            ]
        })

        if(foundUser){
            throw new Error("User already exists.........")
        }

        const isVerifiedMail = await VerifiedMail.findOne({mail})
        if(!isVerifiedMail){
            throw new Error("Pleasr verify your email first.")
        }

        const isPasswordStrong = validator.isStrongPassword(password);
        if(!isPasswordStrong){
            throw new Error("Please Enter a Strong password.")
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const createUser = await User.create({firstName, lastName, username, mail, password: hashPassword, dateofBirth})
        res.status(201).json({msg: "user created successfully!"})

     } catch (error) {
        res.status(400).json({error: error.message})
        
    }
})

router.post("/signin", async (req, res) => {
    try {
        
        const {username, password} = req.body;

        const foundUser = await User.findOne({username})
        if(!foundUser){
            throw new Error("User does not exists..")
        }

        const flag = await bcrypt.compare(password, foundUser.password)
        if(!flag){
            throw new Error("Invalid Password")
        }

        const token = jwt.sign({id: foundUser._id}, process.env.JWT_SECRET)
        const {firstName, lastName, username: un, profilePicture, bio, following, followers, post, dateofBirth} = foundUser
        res.cookie("loginToken", token, {maxAge: 24 * 60 * 60 * 1000}).status(200).json({msg: "done", data: {firstName, lastName, username: un, profilePicture, bio, following, followers, post, dateofBirth}})

    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

router.post("/signout", (req, res) => {
    res.cookie("loginToken", null).status(200).json({msg: "logout successfully"})
})

module.exports = {
    userRouter: router,
}