const express=require('express');
const authRouter=express.Router();
const {validateSignupData}=require("../helpers/validation")
const User=require("../models/user");
const bcrypt=require("bcrypt");
const validator=require("validator");
const { userAuth } = require('../middelware/auth');


authRouter.post("/signup",async (req,res)=>{
    try{
    console.log("triggered")
    const userObj=req.body
    validateSignupData(req);
    console.log(userObj)
    const {firstName,lastName,emailId,password}=req.body;

    const passwordHash=await bcrypt.hash(password,10);
    console.log(passwordHash);
    // const userObj={
    //     firstName:"Ms dhoni",
    //     lastName:"Arshad",
    //     emailId:"shsd@arshad.com",
    //     password:"akshat@qw12"
    // }
    // creating a new instance of the user model
    const user=new User({
        firstName,lastName,emailId,password:passwordHash
    });

     await user.save();
    res.send("done")
     }
     catch(err){
        console.log(err);
         res.status(400).send("something went wrong");
     }

})
authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        console.log(user);
        if(!validator.isEmail(emailId)){
            throw new Error("email Invalid");
        }
        if(!user){
            throw new Error("Invalid Credential");
        }
        const ispassWordValid=await user.validatePassword(password);
        if(ispassWordValid){

            //create a jwt token
            const token=await user.getJWT();

            //add token to cookie and send the responce to the user
            res.cookie("token",token);
            res.send("Password Valid");
        }
        else{
            throw new Error("Invalid Credential");
        }



    }
    catch(err){
        console.log(err.message);
        res.status(400).send(`something went wrong ${err.message}`);
    }
    
})
authRouter.post("/logout",async (req,res)=>{
    try{
        res.cookie("token",null,{
            expires:new Date(Date.now())
        })
       
           
            res.send("user logged Out");
    }
    catch(err){
        console.log(err.message);
        res.status(400).send(`something went wrong ${err.message}`);
    }
    

})
authRouter.post("/updatePassword",userAuth,async (req,res)=>{
    try{
     let {newPassword,oldPassword}=req.body;
     let user=req.user;
      const isPasswordValid=await user.validatePassword(oldPassword);
     if(!isPasswordValid){
        throw new Error("password not valid");
     }
     const passwordHash=await bcrypt.hash(newPassword,10);
      console.log(passwordHash);
      user.password=passwordHash;
      user.save();
      res.send("password updated");
    }
    catch(err){
        console.log(err.message);
        res.status(400).send(`something went wrong ${err.message}`);
    }

})

module.exports=authRouter;