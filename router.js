const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const User=require('./schema');
const fs=require('fs');
const jtw=require('jsonwebtoken');

const imgpath='./public/shloka.jpg';
const scrt='satyajit@$*12/wturs&oilt@^jghfhugjhfgtt';
router.post('/register',async (req,res)=>{
    const {name,email ,password}=req.body;
    if(!email && !password)
    {
        res.json({err:"fill the entire data"});
        return;
    }
     try{
        const valid=await User.findOne({email:email});
        if(valid)
        {
            return res.status(300).json({mess:"already exist"});
        }
        else{
            const salt=await bcrypt.genSalt(10);
            const t1=await bcrypt.hash((password),salt);
            
            const user=new User({name:name,email:email,password:t1,img1:fs.readFileSync(imgpath,'base64')});
            const done=await user.save();
            if(done)
            {
                // return res.status(200).json({success:true,user});
                const token=jtw.sign({id:user.id},scrt);
                 return res.status(200).json({mess:'Registration Completed',user,token});
                
            }
            else
            return res.status(500).json({mess:"try again"});
        }
     }
     catch(err)
    {
        res.status(402).json({ mess: "Some error occur"});
        console.log(err);
    }
})
//endpoint for login
router.post('/login',async (req,res)=>{
    const {email,password}=req.body;
    if(!email && !password)
    {
        res.json({mess:"fill the entitre data"});
        return;
    }
    try{
        const valid=await User.findOne({email:email});
        if(valid)
        {
            const valid1=await bcrypt.compare(password,valid.password);
            if(valid1)
            {
                const token=jtw.sign({id:valid.id},scrt);
                return res.status(200).json({mess:"Successful",valid,token});
            }
            else
            {
                return res.status(400).json({mess:"invalid data"});
            }
        }
        else{
            return res.status(300).json({mess:"check your data"})
        }
    }
    catch(err)
    {
        res.status(402).json({ mess: "Some error occur" });
        console.log(err);
    }
})
//delete endpoint
router.delete('/delete',async (req,res)=>{
    const {email,password}=req.body;
    if(!email && !password)
    {
        res.json({err:"fill the entitre data"});
        return;
    }
    try{
        const valid=await User.findOne({email:email});
        if(valid)
        {
            const valid1=await bcrypt.compare(password,valid.password);
            if(valid1)
            {
                const t2=await User.deleteOne(valid);
                if(t2)
                return res.status(200).json({success:"deleted"});
                else
                return res.status(300).json({sorry:"some server issue"});
            }
            else
            {
                return res.status(400).json({sorry:"invalid data"});
            }
        }
        else{
            return res.status(300).json({err:"check your data"})
        }
    }
    catch(err)
    {
        res.status(402).json({ sorry: "Some error occur" });
        console.log(err);
    }
})
router.get('/tokenvalidation',async (req,res,next)=>{
    const tok=req.header('token');
   
    if(!tok)
    return res.status(200).json({message:"notavailable"});
    try{
         const valid=jtw.verify(tok,scrt);
         if(valid)
         {
            const user=await User.findById(valid.id);
            return res.status(200).json({message:"verified",user});
         }
         else
         return res.status(300).json({message:"Notverified"});
    }
    catch(err)
    {
        res.status(402).json({ sorry: "Some error occur" });
    }
})
module.exports=router;