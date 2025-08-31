import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.headers.token;
        if(!token){
            return res.json({success:false,message:"Unauthorized access"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.json({success:false,message:"Unauthorized access"});
        }
        const user=await User.findById(decoded.user).select("-password");
        if(!user){
            return res.json({success:false,message:"Unauthorized access"});
        }
        req.user=user;
        next();
    }catch(err){
        console.log(err.message);
        res.json({success:false,message:"Unauthorized access"});
    }
}

export const checkAuth=(req,res)=>{
    res.json({success:true,user:req.user});
}