const express=require("express");
const { userAuth } = require("../middelware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter=express.Router();
const USER_SAFE_DATA=["firstName","lastName","photoUrl","age","gender","about","skills"];
const User=require("../models/user");

//get all pending conection request for the logged in uaer
userRouter.get("/user/requests",userAuth,async (req,res)=>{
   try{
    const loggedInUser=req.user;
    const connectionReq=await ConnectionRequest.find({
        toUserId:loggedInUser._id,
         status:"intrested"
    }).populate("fromUserId",["firstName","lastName"]);
    console.log(connectionReq);
    res.json({message:"data fetch successfully",
        data:connectionReq
    });

   }
   catch(err){
    req.status(400).send("ERROR"+err.message);
   }
})
userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try {
        const loggedInUser=req.user;
        console.log(loggedInUser);
        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accept"},
                 {fromUserId:loggedInUser._id,status:"accept"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        console.log()
const data=connectionRequests.map(row=>{
    if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
        return row.toUserId
    }
    return row.fromUserId
});

        res.json({data:data});
        
    } catch (error) {
         res.status(400).send("ERROR"+error.message)
    }
})
userRouter.post("/user/feed",userAuth,async (req,res)=>{
    try {
         const loggedInUser=req.user;
         const page=parseInt(req.query.page)||1;
         const limit=parseInt(req.query.limit)||10;
         limit>1000?1000:limit;
         const skip=(page-1)*limit;

         const sentReq=await ConnectionRequest.find({
            $or:[
                {
            fromUserId:loggedInUser._id
                },
                {
            toUserId:loggedInUser._id
                }

            ]
         }).select("fromUserId toUserId");
         const hideUsersFromFeed=new Set();
           sentReq.forEach(req=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString())

        });
        const user= await User.find({
            $and:[
            {_id:{$nin:Array.from(hideUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        console.log(user);
        
         console.log(hideUsersFromFeed);
         res.json(user);
        
    } catch (error) {
         res.status(400).json({message:error.message})
    }
   

})


module.exports=userRouter;