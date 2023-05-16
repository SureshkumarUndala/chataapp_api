const mongoose = require("mongoose")

const chatSchema = mongoose.Schema({
    chatName:{
        type: String,
        trim:true , // it removes trailing spaces after and before the name
        
    },
    isgroupchat:{
        type:Boolean,
        default:false

    },
    users: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    latestMessage:{
        type:mongoose.ObjectId.Schema.Types.ObjectId,
        ref:"Message"
    },
    isgroupAdmin:{
        type:mongoose.ObjectId.Schema.Types.ObjectId,
        ref:"User"
    }


},{timestamps:true})

const Chat = mongoose.model("chat", chatSchema)
module.exports = Chat