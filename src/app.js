const express=require("express");

const app=express();
const connectDb=require('./config/database')
const User=require("./models/user");
const {validateSignupData}=require('./helpers/validation')
const bcrypt=require("bcrypt");
const cookieParser=require("cookie-parser")
const jwt=require('jsonwebtoken');
app.use(express.json())
app.use(cookieParser());
const validator=require("validator");
const {userAuth}= require("./middelware/auth")
app.post("/signup",async (req,res)=>{
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
app.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
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
app.get("/user",async (req,res)=>{
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
app.delete("/user",async (req, res)=>{
 try{
    const userId=req.body.userId;
    const user=await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
    
 }
 catch(err){
      console.log(err)
        res.status(400).send("something went wrong");
 }
})

app.get("/feed",async (req,res)=>{
    try{
        const users= await User.find({});
        res.send(users);
        
    }
    catch(err){
         res.status(400).send("something went wrong");
    }
})
//update data of the user

app.patch("/user/:userId",async (req,res)=>{
try{
    const data=req.body;
    const userId=req.params?.userId;
    await User.findByIdAndUpdate({_id:userId},data,{
        runValidators:true
    });
    res.send("userUpdated successfully");

}
catch(err){
    console.log(err);
     res.status(400).send("something went wrong:"+err.meeesge);
    
}
})
app.get("/profile",userAuth,async(req,res)=>{
    try{
    // const cookies=req.cookies;
    // const {token}=cookies;
    // if(!token){
    //    throw new Error("token not found");
    // }

    
    const user=req.user;
    if(!user){
      throw new Error("user not found");
    }




    // console.log(cookies);
    res.send(user);
}
catch(err){
    res.status(400).send("ERROR "+err.message )
}
})
app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    res.send("connection successfull");
})

connectDb().then(()=>{
    console.log("Database connected successfull");
    app.listen(3000,()=>{
    console.log("listening on port 3000")
});
}).catch(err=>{
    console.log("Database cannot be connected");
})

app.use((req,res)=>{
    res.send("Hello from server ")
})