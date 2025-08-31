import {createContext, useContext} from "react";
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const ChatContext=createContext();

export const ChatProvider=({children})=>{
    const [msg,setMsg]=useState([]);
    const [user,setUser]=useState([]);
    const [selectedUser,setSelectedUser]=useState(null);
    const [unseenMsg,setUnseenMsg]=useState([]);

    const {socket,axios}=useContext(AuthContext);

    const getUsers=async()=>{
        try{
            const {data}=await axios.get("api/msg/users");
            if(data.success){
                setUser(data.users);
                setUnseenMsg(data.unseenMsg);
            }
        }catch(err){
            toast.error(err.message);
        }
    }

    const getMsgs=async(userId)=>{
         try{
            const {data}=await axios.get(`/api/msg/${userId}`);
            if(data.success){
                setMsg(data.message);
            }

         }catch(err){
            toast.error(err.message);
         }
    }

    const sendMsg=async(msgData)=>{
         try{
           const {data}=await axios.post(`/api/msg/send/${selectedUser._id}`,msgData);
           if(data.success){
            setMsg((prevmsg)=>[...(prevmsg || []),data.newMsg]);
           }else{
            toast.error(data.message);
           }
         }catch(err){
            toast.error(err.message);
         }
    }

    const subscribeToMsg=async()=>{
        if(!socket) return;


        //we are subscribing(listening) to newMsg from server, any user sends a msg the backend emits newMsg, frontend hears it because it is subscribed, then setmsg is updated
        //if we dont subscribe we cant get live msgs we can only see new msg if we refresh or made an api call.
        socket.on("newMsg",(newMsg)=>{
            if(selectedUser && newMsg.senderId===selectedUser._id){
                newMsg.isSeen=true;
                setMsg((prevmsg)=>[...(prevmsg || []),newMsg]);
                axios.put(`/api/msgs/mark/${newMsg._id}`);
            }else{
                setUnseenMsg((prevUnseenMsg)=>({...prevUnseenMsg,[newMsg.senderId]:(prevUnseenMsg[newMsg.senderId] || 0)+1}) );
            }
        })
    }

    const unsubscribeFromMsg=()=>{
        if(socket) socket.off("newMsg");
    }

    useEffect(()=>{
        subscribeToMsg();
        return()=>unsubscribeFromMsg();
    },[socket,selectedUser]);
    const value={
        msg,
        user,
        selectedUser,
        unseenMsg,
        getUsers,
        setMsg,
        sendMsg,
        setSelectedUser,
        setUnseenMsg,
        getMsgs

    }
    return <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
}