const mongoose = require("mongoose")
const validator = require("validator")


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 10,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 10,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        maxlength: 10,
        trim: true,
        required: true,
        unique: true,
        immutable: true
    },
    mail: {
        type: String,
        validate: (val)=> {
            const isEmail = validator.isEmail(val)
            if(!isEmail){
                throw new Error("Invalid Email")
            }
        },
        required: true,
        unique: true,
        trim: true,
        immutable: true,
    },
    password: {
        type: String,
        required: true,
    },
    dateofBirth: {
        type: String,
        required: true,
        trim: true,
        validate: (val) => {
            const isDateValid  = validator.isDate(val)
            if(!isDateValid){
                throw new Error("Invalid Date, use YYYY/MM/DD or YYYY-MM-DD")
            }
        },
        immutable: true
    },
    post: [],
    followers: [],
    following: [],
    bio: {
        type: String,
        maxlength: 100,
        trim: true
    },
    profilePicture: {
        type: String,
    }
},{timestamps: true})

const User = mongoose.model("user", userSchema)

module.exports = {
    User
}