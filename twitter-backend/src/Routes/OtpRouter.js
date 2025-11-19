const express = require("express");
const router = express.Router();
const { VerifiedMail } = require("../Models/VerifiedMail");
const nodemailer = require("nodemailer");
const { otpLimiter } = require("../Middleware/OtpRateLimit");
const { OTP } = require("../Models/Otp");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dasakash.9355@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

router.post("/otp/send-otp", otpLimiter, async (req, res) => {
  try {
    const { mail } = req.body;
    const otp = String(Math.floor(Math.random() * 1000000)).padEnd(6, 0);
    const vm = await OTP.create({ mail, otp });

    await transporter.sendMail({
      from: ' "Akash" dasakash.9355@gmail.com',
      to: mail,
      subject: "OTP",
      html: `
  <div style="
    font-family: Arial, sans-serif; 
    background-color: #f4f4f4; 
    padding: 20px;
  ">
    <div style="
      max-width: 500px; 
      margin: auto; 
      background: #ffffff; 
      padding: 30px; 
      border-radius: 10px; 
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    ">
      <h2 style="text-align:center; color:#333; margin-bottom:20px;">
        🔐 Email Verification OTP
      </h2>

      <p style="font-size:16px; color:#444;">
        Hi,
        <br><br>
        Use the following One-Time Password (OTP) to verify your email address:
      </p>

      <div style="
        text-align:center; 
        margin: 30px 0;
      ">
        <span style="
          font-size:32px; 
          font-weight:bold; 
          letter-spacing: 6px; 
          color:#2c3e50;
          display:inline-block; 
          background:#f1f1f1; 
          padding: 15px 25px; 
          border-radius: 8px; 
          border: 1px solid #ddd;
        ">
          ${otp}
        </span>
      </div>

      <p style="font-size:15px; color:#555;">
        This OTP will expire in <strong>5 minutes</strong>.  
        Please do not share this code with anyone.
      </p>

      <p style="margin-top:30px; font-size:14px; color:#777; text-align:center;">
        If you didn’t request this, you can safely ignore this email.
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:25px 0">

      <p style="font-size:12px; color:#999; text-align:center;">
        © ${new Date().getFullYear()} Your App Name. All rights reserved.
      </p>
    </div>
  </div>
`,
    });

    res.status(201).json({ message: "OTP sent ✅" });
  } catch (error) {
    res.status(401).json({ err: error.message });
  }
});

router.post("/otp/verify-otp", async (req, res) => {
  try {
    const { mail, otp } = req.body;
    const foundObject = await OTP.findOne({
      $and: [{ mail }, { otp }],
    });

    if(!foundObject){
      throw new Error("Invalid email/otp")
    }

    await VerifiedMail.create({mail})
    res.status(201).json({msg: "User Verified"})
  } catch (error) {
    res.status(401).json({ err: error.message });
  }
});

module.exports = {
  otpRouter: router,
};
