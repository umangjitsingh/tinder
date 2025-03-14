import express from "express";
import {userAuth} from "../middlewares/auth.js";
const requestsRouter = express.Router()

requestsRouter.post('/sendFriendRequest', userAuth, async (req, res) => {
   const user = req.user;
   res.send(`${user.firstName} ${user.lastName} is sending a friend request`)
})
export  default  requestsRouter;