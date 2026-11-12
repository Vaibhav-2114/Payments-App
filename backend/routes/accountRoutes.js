import express from "express"
import { addMoney, checkBalance } from "../controllers/accountController.js"
import { requireAuth } from "../middleware/requireAuth.js";
import { transferMoney } from "../controllers/accountController.js";

const accountRouter = express.Router()

accountRouter.get('/balance', requireAuth, checkBalance);
accountRouter.post('/transfer', requireAuth, transferMoney);
accountRouter.get('/addmoney', requireAuth, addMoney)

export default accountRouter;
