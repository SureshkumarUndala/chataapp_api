const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const router = require("./Routes/userRoutes")
const chatRoutes = require("./Routes/chatRoutes")

 

app.use(express.json())


mongoose.connect(process.env.MongoDB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology : true
})
.then(()=>console.log("connected to Mongodb"))
.catch((err)=>console.log(err))

app.use("/api/v1/users", router)
app.use("/api/v1/chat", chatRoutes)


app.all("*",(req,res)=>{
    res.json({
        message:"wrong endpoint"
    }) 
})



app.listen(process.env.port, ()=>console.log(`server started at ${process.env.port}`))


