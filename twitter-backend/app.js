require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {otpRouter} = require("./src/Routes/OtpRouter");
const { userRouter } = require("./src/Routes/UserRouter");

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("DB connected");
    
    app.listen(process.env.PORT, () => {
        console.log("Server Starting in port " + process.env.PORT);
    });
}).catch((error) => {
    console.log("Db Connection Failed")
}) 

app.use(express.json()) 
app.use("/api",otpRouter)
app.use("/api",userRouter)
 




