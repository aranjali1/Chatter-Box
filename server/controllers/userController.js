import User from '../models/User.js';
import { generateToken } from '../lib/utils.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';

export const signup=async (req, res) => {
    const {fullName,email,password,bio}=req.body;
    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success:false, message:"Missing details"});
        }
        const user=await User.findOne({email});
        if(user){
            return res.json({success:false,message:"Account already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashed=await bcrypt.hash(password,salt);
        const newUser=await User.create({fullName,email,password:hashed,bio});
        const token=generateToken(newUser._id);
        res.json({success:true, userData:newUser,token,message:"Account created successfully"});
    }catch(err){
        console.log(err.message);
        res.json({success:false,message:err.message});
    }    
}

export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.json({success:false,message:"Missing details"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.json({success:false,message:"Account does not exist"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Incorrect password"});
        }
        const token=generateToken(user._id);
        res.json({success:true,userData:user,token,message:"Login successful"});
    }catch(err){
        console.log(err.message);
        res.json({success:false,message:err.message});
    }
}