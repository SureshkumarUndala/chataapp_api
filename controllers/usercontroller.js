const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secret = process.env.secret
const User = require("../models/userModel")



const registerUser = async (req, res) => {


    //1. check wheather the user is already existed or not
    //2.if user is new user then create it
    //3.if user is already existed then send message like that user already existed
    const { name, password, email } = req.body

    try {
        if (!name || !password || !email) {
            return res.status(400).json({
                status: "one or more fields are empty",

            })
        }
        const existedUser = await User.findOne({ email })
        if (existedUser) {
            return res.status(400).json({
                error: "user is already existed"
            })

        }

        // encryping the users password  before saving
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    status: "Failed",
                    error: err.message

                })
            }
            const newuser = await User.create({
                name: name,
                email: email,
                password: hash
            })
            return res.status(201).json({
                status: "Success",
                message: "user created successfully",
                user: newuser
            })

        })
    }

    catch (e) {
        res.json({
            status: "error",
            message: e.message


        })
    }

}

const loginUser = async (req, res) => {
 
    const { email, password } = req.body

    try {
        //1. we check wheather user having the account with  the given email or not
        const existeduser = await User.findOne({ email: email })
        if(!existeduser){
            return res.status(409).json({
                status:"Failed",
                message:"There is no account with this email"

            })
        }
        //2. if user already there , check the given password
        bcrypt.compare(password,existeduser.password, (err,result) =>{
            if(err){
                return res.json({
                    status:"Failed",
                    message:err.message
                })
            }
            if(result){       // the result is true when both passwords are matched, other wise result is false
             const token =jwt.sign({_id:existeduser._id},secret)
            return res.status(200).json({
                status:"Successful",
                message:"Login success",
                token : token
            })
            }
            else{
                return res.status(401).json({
                    status:"Failed",
                    message:"Invalid Credentials"
                })
            }
        })



    }


    catch (err) {
 
        res.json({
            status:"Failed",
            error: err.message
        })
    }
}


//get all users
const getAllusers = async(req,res)=>{
    console.log(req.search)

    try{
        const username = req.query.search
        let user;   // getting all users except current user
         console.log(req.user._id)
         if(username){
             user = await User.find({$and:[
                {$or:[{name:{$regex:username, $options:"i"}},{
                    email:{$regex:username, $options:"i"}
                }
                ]}
                ,{_id:{$ne:req.user._id}}]}).select("-password")
         }
         res.send(user)

  
    }
    catch(err){
        res.status(500).json({
            status:"Failed",
            error:err.message
        })
    }
   

}





module.exports = { registerUser, loginUser, getAllusers} 