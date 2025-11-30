const express= require("express");
const requestRouter=express.Router();
const {userAuth}= require("../middelware/auth");
const ConnectionRequest = require("../models/connectionRequest")
const User=require("../models/user");
const user = require("../models/user");


requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
    const fromUserId=req.user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status;
    const allowedStatus=["intrested","ignored"]
 
    if(!allowedStatus.includes(status)){
        return res.status(400).json(`invalid status type ${status}`);
    }
    //chack id there is an existing connection request
    
    const existingConnectionRequest=await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
    ]
    })
    if(existingConnectionRequest){
        return res.status(400).json('connection request already exist');
    }
    const toUser=await User.findById(toUserId)
    if(!toUser){
        return res.status(400).json("user not found");
    }
   

    const connectionRequest= new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    })
   
    const data=await connectionRequest.save();

    res.json({
        message:"Connection request send successfully",
        data
    })
    }
    catch(err){
         res.status(400).send("ERROR "+err.message )
    }
})
requestRouter.post("/request/review/:status/:requestId",userAuth, async (req,res)=>{
    try{
    const user=req.user;
    console.log(user);
   const allowedStatus=["rejected","accepted"];
    const {status,requestId}=req.params;
    console.log(requestId);
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"status invalid"});
    }
    const request=await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:user._id,
        status:'intrested'
    });
    console.log(request);
    
    
    if(!request){
         return res.status(400).json({message:"request invalid"});
    }
    if(request.status!="intrested"){
         return res.status(400).json({message:"operation not allowed"});
    }
    console.log(request)
    console.log(user);    
    if(!user._id.equals(request.toUserId)){
        return res.status(400).json({message:"user not authorized"});
    }
    request.status=status;
    await request.save();

    return res.send("responce saved successfully");

    }
    catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
    
})
module.exports=requestRouter;