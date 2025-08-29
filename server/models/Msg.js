import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    receiverId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    text:{type:String, required:true},
    media:{type:String, default:""},
    isRead:{type:Boolean, default:false},
    
},{timestamps:true});

const Msg=mongoose.model("Msg",msgSchema);

export default Msg;