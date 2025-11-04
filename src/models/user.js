const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const bcrypt=require("bcrypt");
const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        unique:true
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address"+ value)
            }

        }
    },
    password:{
        type:String
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,

        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error("gender is not valid");
            }
        }
    },
    photoUrl:{
        type:String
    },
    about:{
        type:String,
        default:"this is random"
    },
    skills:{
        type:[String]
    }
},{timestamps:true})
userSchema.index({firstName:1,lastName:1});

userSchema.methods.getJWT=async function(){
    const user=this;
    const token=jwt.sign({_id:user._id},"password",{expiresIn:6000});
    return token

}
userSchema.methods.getExpireJwt=async function() {
       const user=this;
    const token=jwt.sign({_id:user._id},"password",{expiresIn:0});
    return token
}
userSchema.methods.validatePassword=async function(password){
    const user=this;
    const isPasswordValid=await  bcrypt.compare(password,this.password);
    return isPasswordValid;
}
module.exports=mongoose.model("User",userSchema);
