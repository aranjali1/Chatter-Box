import express from 'express';
import { login, signup } from '../controllers/userController.js';
import {protectRoute} from '../middleware/auth.js';
import { checkAuth } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post("/sigup", signup);
userRouter.post("/login", login);
userRouter.get('/check',protectRoute,checkAuth);

export default userRouter;