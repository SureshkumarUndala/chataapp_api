const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const secret = process.env.secret

 const protectRoute = async(req,res,next) =>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split("Bearer ")[1]
        jwt.verify(token,secret,async(err,decode)=>{
            if(err){
                return res.status(400).json({
                    status:"Failed",
                    error:err.message
                })
            }
            req.user = await User.findOne({_id:decode._id}).select("-password")
            next()
         
        })
    }
    else{
        res.status(400).json({
            status:"Failed",
            error:"token was Not Found"
        })
    }
}

module.exports = {protectRoute}
