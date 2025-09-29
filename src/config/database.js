const mongoose=require('mongoose');
const connectDb=async()=>{
await mongoose.connect('mongodb+srv://shariquearshad:iJzKjx4w8Sm_RCc@cluster0.12du51t.mongodb.net/devTinder');
}

module.exports=connectDb;




