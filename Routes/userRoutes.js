const express = require("express")
const router = express.Router()
const { registerUser,loginUser,getAllusers } = require("../controllers/usercontroller")

const { body, validationResult } = require('express-validator');
const { protectRoute } = require("../middlewares/authmiddleware");




router.post("/register",
  //email must be email
 body("email").isEmail(),
 // is name is alhabetical 
 body("name").isAlphanumeric(),
 //password length is minimum 5
 body("password").isLength({min:5}),(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next()
 }
  ,registerUser)

router.post("/login",body("email").isEmail(),
        (req,res,next)=>{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()})
            }
            next()
        } ,loginUser)

//get all users

router.get("/",protectRoute, getAllusers)





module.exports = router