const express= require("express");
const requestRouter=express.Router();
const {userAuth}= require("../middelware/auth")


requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    res.send("connection successfull");
})
module.exports=requestRouter;