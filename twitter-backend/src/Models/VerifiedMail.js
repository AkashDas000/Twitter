const mongoose = require("mongoose")
const validator = require("validator")

const verifiedMailSchema = new mongoose.Schema({
    mail:{
        type: String,
        required: true,
        validate: (val) => {
            const isEmail = validator.isEmail(val)
            if(!isEmail){
                throw new Error("Invalid Email")
            }
        }
    }, 
    isVerfied: {
        default: false,
        enum: {
            value: [true, false],
            message: "`{VALUE}` provided for key `{PATH} is invalid`"
        }
    },
    otp: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 6
    }
})

const VerifiedMail = mongoose.model("VerifiedMail", verifiedMailSchema)

module.exports = {
    VerifiedMail,
}