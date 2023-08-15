const mongoose=require('mongoose');


const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    img1:{
        type:String
    }
    
})
const user=mongoose.model('User',userschema);
module.exports=user;