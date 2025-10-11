const express=require("express");

const app=express();
const connectDb=require('./config/database')
const User=require("./models/user");
app.use(express.json())
app.post("/signup",async (req,res)=>{
    try{

   
    console.log("triggered")
    const userObj=req.body
    console.log(userObj)
    // const userObj={
    //     firstName:"Ms dhoni",
    //     lastName:"Arshad",
    //     emailId:"shsd@arshad.com",
    //     password:"akshat@qw12"
    // }
    // creating a new instance of the user model
    const user=new User(userObj);

     await user.save();
    res.send("done")
     }
     catch(err){
        console.log(err);
         res.status(400).send("something went wrong");
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