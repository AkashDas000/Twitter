const express = require("express")
const router = express.Router()
const {VerifiedMail} = require("../Models/VerifiedMail")

router.post("/otp/send-otp", async (req, res) => {
    try {
        const {mail} = req.body
        const otp = Math.floor(Math.random() * 1000000)
        const vm = await VerifiedMail.create({mail, otp})
        res.json("ok")
    } catch (error) {
        res.status(401).send("Invalid")
    }
})

