const express=require("express");

const app=express();
const connectDb=require('./config/database')
const User=require("./models/user");
app.use(express.json())
app.post("/signup",async (req,res)=>{
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