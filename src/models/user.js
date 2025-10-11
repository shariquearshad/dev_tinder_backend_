const mongoose=require('mongoose');
const validator=require('validator');
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
module.exports=mongoose.model("User",userSchema);
