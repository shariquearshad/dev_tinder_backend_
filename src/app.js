const express=require("express");

const app=express();
const connectDb=require('./config/database')
const User=require("./models/user");
const cookieParser=require("cookie-parser");
const cors=require("cors");
require("dotenv").config();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json())
app.use(cookieParser());



const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter=require("./routes/user");



app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

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
    app.listen(process.env.PORT,()=>{
    console.log("listening on port 3000")
});
}).catch(err=>{
    console.log("Database cannot be connected");
})

app.use((req,res)=>{
    res.send("Hello from server ")
})