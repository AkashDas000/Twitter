require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json()) 

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("DB connected");
    
    app.listen(process.env.PORT, () => {
    console.log("Server Starting in port " + process.env.PORT);
});
}).catch((error) => {
    console.log("Db Connection Failed")
}) 





