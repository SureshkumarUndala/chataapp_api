
const Chat = require("../models/chatmodel")

const accessChat = async(req,res)=>{
 const {userId} = req.body
try{
    if(!userId){
        return res.status(400).json({
            status:"Failed",
            error:"userId param not sent with requst"
        })
     }
     //check chat exists with these userId
     let isChat = await Chat.find({
        isgroupchat:false,
        users:{$all:[req.user._id,userId]}

    
             }).populate("users", "-password").populate("latestMessage")
    let chatdata;
    console.log(isChat)
     if(isChat.length>0){
        return res.status(200).json({
            isChat
        })
     }
     else{
        chatdata = {
            chatName :"sender",
            isgroupchat:false,
            users:[req.user._id,userId]
        }
     }
     console.log(chatdata)
     const createdChat = await Chat.create(chatdata)
     const Fullchat = await Chat.find({_id:createdChat._id}).populate("users", "-password")

     return res.status(200).json({
        Fullchat
     })




}
catch(err){
    return res.status(500).json({
        status:"Failed",
        error:err.message
    })
  


}
 
}

const fetchChats = async(req,res)=>{

    try{

        const chats  = await Chat.find({users:{$all:[req.user._id]}})
        .populate("users", "-password")
        .populate("isgroupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt : -1})
        return res.json({
            status:"success",
            chats:chats
        })


    }
    catch(err){
        return res.json({
            status:"Failed",
            error:err.message
        })
    }


}

const createGroupChat = async(req,res) =>{
    const {users, name} = req.body
  

    //here we take bunch of users and name of groupchat from body
  try{
    if(!req.body.users || !req.body.name){
        return res.status(400).json({
            status:"Failed",
            error:"Please fill all the fields"
        })
    }
   //users coming through request is in json format so we parse it for actual array
    let users = JSON.parse(req.body.users)
    if(users.length>2){
        return res.json({
            status:"Failed",
            error:"more than 2users are required to form a group"
        })
    }
    // we push current loggedin user in to users
    users.push(req.user)
    
    // create groupchat 
    const groupChat = await Chat.create({
        chatName: req.body.name,
        users:users,
        isgroupchat:true,
        isgroupAdmin: req.user   // logged in user is the admin of group
    })

    const fullGroupChat = await Chat.findOne({_id:groupChat.id})
    .populate("users", "-password")
    .populate("isgroupAdmin", "-password")

    res.status(200).json({
        status:"success",
        fullGroupChat:fullGroupChat
    })

  }

  catch(err){
    return res.status(500).json({
        status:"Failed",
        error:err.message
    })

  }

}

const renameGroup = async(req,res)=>{
    try{
        const {chatId,chatname} = req.body

        if(!chatId || !chatname){
            return res.status(400).json({error:"all fields are mandatory"})
        }

        const updatedChat = await Chat.findByIdAndUpdate(chatId,
            {chatName:chatname },{new:true})
            .populate("users", "-password")
            .populate('isgroupAdmin', "-password")
        if(!updatedChat){
            return res.status(404).json({
                status:"Failed",
                error:"Chat Not Found"
            })
        }
        else{
            return res.status(200).json({
                status:"success",
                updatedChat:updatedChat
            })
        }
            
    }
    catch(err){
        return res.status(500).json({
            status:"Failed",
            error:err.message
        })
    }
}

const addToGroup = async(req,res)=>{
    try{
        const {chatId, userId} = req.body
        const added = await Chat.findByIdAndUpdate(chatId,
            { $push:{users:userId}},
            {new:true}).populate("users", "-password")
            .populate('isgroupAdmin', "-password")
            
        if(!added){
            return res.status(400).json({error:"chat was not found"})
        }
        return res.json({
            status:"success",
            added:added
        })
    }
    catch(err){
        res.status(500).json({
            status:"Failed",
            error:err.message
        })
    }
}


const removeFromGroup = async(req,res)=>{
    const {chatId, userId} = req.body

    try{
        const removed = await Chat.findByIdAndUpdate(chatId,
            {$pull:{users:userId}},{
                new:true
            }).populate("users", "-password")
            .populate("isgroupAdmin", "-password")

        if(!removed){
            return res.status(400).json({error:"chat was not found with that id"})
        }
        return res.json({
            status:"success",
            removed:removed
        })


    }
    catch(err){
        res.status(500).json({
            status:"Failed",
            error:err.message
        })
}
}


module.exports = {accessChat, createGroupChat,fetchChats, renameGroup, addToGroup, removeFromGroup}