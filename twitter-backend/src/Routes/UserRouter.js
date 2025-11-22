const express = require("express")
const router = express.Router()
const {User} = require("../Models/User")
const { VerifiedMail } = require("../Models/VerifiedMail")
const validator = require("validator")
const bcrypt = require("bcrypt")


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


module.exports = {
    userRouter: router,
}