import express from "express";
import { signUp, signIn, getCurrentUser, searchUser } from "../controllers/userController.js"
import { requireAuth } from "../middleware/requireAuth.js";

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/signin', signIn);
userRouter.get('/me', requireAuth, getCurrentUser);
userRouter.get('/search', requireAuth, searchUser);

export default userRouter;
