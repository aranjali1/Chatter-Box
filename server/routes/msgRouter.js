import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMsgs, getUsersForSidebar, markMsgsAsRead } from "../controllers/msgController.js";

const msgRouter=express.Router();


msgRouter.get("/users",protectRoute,getUsersForSidebar);
msgRouter.get("/:id",protectRoute,getMsgs);
msgRouter.put("/mark/:id",protectRoute,markMsgsAsRead);

export default msgRouter;