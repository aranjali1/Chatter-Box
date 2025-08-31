import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRouter.js";
import msgRouter from "./routes/msgRouter.js";
import { Server } from "socket.io"; //import server class from socket.io

const app=express();
const server=http.createServer(app)

//initialize socket.io server
export const io=new Server(server,{ //creats socket.io server attached to our http server
  cors:{origin:"*"} //allow frontend(use specific domain in prodn)
})

//store online users
export const userSocketMap={}; //{userId:socketId}

io.on("connection",(socket)=>{ //runs everytime a new user connects
  const userId=socket.handshake.query.userId; //when client connects, it sends its userId as query param
  console.log("New user connected with userId and socketId:",userId,socket.id); //socket.id is unique for each connection
  if(userId){
    userSocketMap[userId]=socket.id;
  }
  //emit online users to all users
  io.emit("getOnlineUsers",Object.keys( userSocketMap));  //object.keys() gives array of all online userids, io.emit() emits to all connected users i.e every client always knows who is online

  //handle user disconnect
  socket.on("disconnect",()=>{
    console.log("User disconnected",userId,socket.id);
    delete userSocketMap[userId]; //remove user from online users map
    //emit online users to all users
    io.emit("getOnlineUsers",Object.keys( userSocketMap));
  });
}); 

app.use(express.json({limit:"4mb"}));
app.use(cors());

app.use("/api/status",(req,res)=>res.send("server is live"));

app.use("/api/auth",userRouter);
app.use('/api/msg',msgRouter);

const startServer=async()=>{
    try{
      await connectDB();
      const PORT=process.env.PORT || 7000;
      server.listen(PORT,()=>console.log("Server is running on PORT:"+PORT));
    }catch(e){
        console.log("Failed to connect to server",e);
    }
};
startServer();



