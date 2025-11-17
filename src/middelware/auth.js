const jwt=require("jsonwebtoken")
const User=require("./../models/user")

const adminAuth=(req,res,next)=>{

}
const userAuth=async (req,res,next)=>{
   try{
     const cookies=req.cookies;
    const {token}=cookies;
     if(!token){
           return res.status(401).send("Please loggin")
        }
        const decodedValue=jwt.verify(token,"password");
         const user=await User.findById(decodedValue?._id);
         if(!user){
            throw new Error("invalid ")
         }
         req.user=user;

        next();
      }
      catch(err){
           res.status(400).send("ERROR "+err.message )
      }
}

module.exports={userAuth,adminAuth};