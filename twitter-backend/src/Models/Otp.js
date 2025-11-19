const mongoose = require("mongoose");
const validator = require("validator");

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    minlength: 6,
    maxlength: 6,
    required: true,
  },
  mail: {
    type: String,
    required: true,
    validate: (val) => {
      const isEmail = validator.isEmail(val);
      if (!isEmail) {
        throw new Error("Invalid Email");
      }
    },
  },
  createAt: {
    type: Date,
    default: Date.now(),
    expires: 120,
  }
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = {
  OTP,
};
