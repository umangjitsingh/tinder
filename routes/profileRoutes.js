import express from "express";
import {userAuth} from "../middlewares/auth.js";
const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {
   try {
      const user = await req.user;

      return res.status(200).json({
         success: true,
         data   : user
      })
   } catch (e) {
      return res.status(400).json({
         success: true,
         message: e.message
      })

   }
})


export default profileRouter;