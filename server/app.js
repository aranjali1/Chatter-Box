import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";

const app=express();
const server=http.createServer(app)

app.use(express.json({limit:"4mb"}));
app.use(cors());

app.use("/api/status",(req,res)=>res.send("server is live"));

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



