import jwt from "jsonwebtoken";
import {UserModel} from "../src/models/user.js";

export const userAuth = async (req, res, next) => {

   try {
      const {token} = req.cookies;
      if (!token) {
         throw new Error("Token is not valid.")
      }

      const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
      console.log(decodedObj);
      const {_id} = decodedObj;

      const user = await UserModel.findById(_id);
      if (!user) {
         throw new Error("User not found");
      }
      req.user = user;
      next();
   } catch (e) {
      res.status(400).json({
         success: false,
         message  : e.message
      })
   }
}