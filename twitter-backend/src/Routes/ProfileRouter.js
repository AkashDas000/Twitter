const express = require("express")
const { isLoggedIn } = require("../Middleware/isLoggedIn")
const router = express.Router()


router.patch("/profile/edit", isLoggedIn, async (req, res) => {
    try {
        res.json({msg: "done"})
    } catch (error) {
        
    }
})

module.exports = {
    profileRouter: router,
}