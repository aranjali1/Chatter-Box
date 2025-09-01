import Msg from "../models/Msg.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../app.js";

export const getUsersForSidebar=async(req,res)=>{
    try{
        const userId=req.user._id;
        const users=await User.find({_id:{$ne:userId}}).select("-password -email -createdAt -updatedAt -__v");

        const unseenMsg={};
        const promises=users.map(async(user)=>{
            const count=await Msg.countDocuments({senderId:user._id,receiverId:userId,isRead:false});
            unseenMsg[user._id]=count;
        });
        await Promise.all(promises);

        res.json({success:true,users,unseenMsg});
    }catch(err){
        console.log(err.message);
        res.json({success:false,message:"Failed to fetch users"});
    }
}


export const getMsgs=async (req,res)=>{
    try{
       const {id:selectedUserId}=req.params;
         const myId=req.user._id;
         const msgs=await Msg.find({
            $or:[
                {senderId:myId,receiverId:selectedUserId},
                {senderId:selectedUserId,receiverId:myId}
            ]
         }).sort({createdAt:1});
            await Msg.updateMany({senderId:selectedUserId,receiverId:myId,isRead:false},{$set:{isRead:true}});
            res.json({success:true,msgs});
    }catch(err){
        console.log(err.message);
        res.json({success:false,message:"Failed to fetch messages"});
    }
}


export const markMsgsAsRead=async(req,res)=>{
    try{
        const {id:selectedUserId}=req.params;
        const myId=req.user._id;
        await Msg.updateMany({senderId:selectedUserId,receiverId:myId,isRead:false},{$set:{isRead:true}});
        res.json({success:true,message:"Messages marked as read"});
    }
    catch(err){
        console.log(err.message);
        res.json({success:false,message:"Failed to mark messages as read"});
    }
}


export const sendMsg=async(req,res)=>{
    try{
        const {text,media}= req.body;
        const receiverId=req.params.id;
        const senderId=req.user._id;
        if(!text&&!media){
            return res.json({success:false,message:"Msg is empty"});
        }
        let imageUrl="";
        if(media){
            const uploadResponse = await cloudinary.uploader.upload(media)
            imageUrl = uploadResponse.secure_url;
        }
        const newMsg=await Msg.create({senderId,receiverId,
            text:text || "",
            media:imageUrl||""});

        //emit the new msg to the receiver's socket
        const receiverSocketId=userSocketMap[receiverId];  //get receiver's socketId from map
        if(receiverSocketId){ //if receiver is online
            io.to(receiverSocketId).emit("newMsg",newMsg); //emit to only that socket
        }
        res.json({success:true,newMsg});

    }catch(err){
        console.log(err.message);
        res.status(500).json({success:false,message:"Failed to send message"});
    }
}