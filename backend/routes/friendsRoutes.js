import express from "express"
import { requireAuth } from "../middleware/requireAuth.js";
import { getFriends, addFriend } from "../controllers/friendsController.js"

const friendRouter = express.Router();

friendRouter.get('/getfriends', requireAuth, getFriends)
friendRouter.post('/addfriend', requireAuth, addFriend)

export default friendRouter;
