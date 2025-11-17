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
const validateEditProfileData=(req)=>{
    const allowedEditField=["firstName","lastName","emailId","photoUrl","gender","age","about"];
    const isEditAllowed=Object.keys(req.body).every(field=>allowedEditField.includes(field))
    return isEditAllowed;
}
module.exports={validateSignupData,validateEditProfileData} 