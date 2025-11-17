const express=require('express');
const profileRouter=express.Router();
const User=require("../models/user");
const {userAuth}= require("../middelware/auth")
const {validateEditProfileData}=require("../helpers/validation");


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
   

    
    const user=req.user;
    if(!user){
      return res.status(401);
    }




    // console.log(cookies);
    res.send(user);
}
catch(err){
    res.status(400).send("ERROR "+err.message )
}
})
profileRouter.get("/user",async (req,res)=>{
    try{
        console.log("triggered")
 const email=req.body.emailId;
 console.log("email",email)
     const user=await User.findOne({emailId:email});
     if(user.length===0){
        res.status(404).send("User not found");
     }
     console.log(user);
     res.send(user);
    }
    catch(err){
        console.log(err)
        res.status(400).send("something went wrong");
    }
   
})
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    console.log("triggered");
    try{
        if(!validateEditProfileData(req)){
            return res.status(400).send("Edit not allowed");
        }
        const loggedInUser=req.user;
        Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key]);
        await loggedInUser.save();

       
        res.send(loggedInUser);
    }
    catch(err){
          res.status(400).send("ERROR "+err.message )
    }
})

module.exports=profileRouter;