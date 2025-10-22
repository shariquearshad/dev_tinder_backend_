const validator=require("validator")
const validateSignupData=(req)=>{
    const{firstName,lastName,emailId,password} =req.body;
    if(!firstName||!lastName){
        throw new Error("Name not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }


}
module.exports={validateSignupData} 