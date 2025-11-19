const express = require("express")
const router = express.Router()
const {VerifiedMail} = require("../Models/VerifiedMail")
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth : {
        user: 'dasakash.9355@gmail.com',
        pass: process.env.APP_PASSWORD
    }
})

router.post("/otp/send-otp", async (req, res) => {
    try {
        const {mail} = req.body
        const otp = String(Math.floor(Math.random() * 1000000)).padEnd(6, 0)
        const vm = await VerifiedMail.create({mail, otp})

        await transporter.sendMail({
            from: "dasakash.9355@gmail.com",
            to: mail,
            subject: "OTP",
            html: `<h1>${otp}</h1>`

        })

        res.json(otp)
    } catch (error) {
        res.status(401).json({err: error.message})
    }
})

module.exports = {
    otpRouter: router
}