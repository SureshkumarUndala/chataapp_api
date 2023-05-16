const express = require("express")
const app = express()
const dotenv = require("dotenv")
const Port = process.env.Port
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
dotenv.config()

app.use(bodyparser)

mongoose.connect(process.env.MongoDB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology : true
})
.then(()=>console.log("connected to Mongodb"))
.catch((err)=>console.log(err))

app.use("/api/v1/users", userRoute)

app.listen(Port, ()=>console.log("server started at 8080"))


