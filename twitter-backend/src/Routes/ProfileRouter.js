const express = require("express")
const { isLoggedIn } = require("../Middleware/isLoggedIn")
const { User } = require("../Models/User")
const router = express.Router()


router.patch("/profile/edit", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id
        const {firstName, lastName, bio, profilePicture} = req.body
        const updateProfile = await User.findByIdAndUpdate(userId, {firstName, lastName, bio, profilePicture}, {new: true}).select("firstName lastName bio profilePicture dateOfBirth username post followers following")
        res.status(200).json({msg: "done", data: updateProfile})
    } catch (error) {
        res.status(400).json({error: error.message}) 
    }
})

module.exports = {
    profileRouter: router,
}