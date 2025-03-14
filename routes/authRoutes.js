import express from 'express';
import {validateSignUpData} from "../src/helpers/validation.js";
import {UserModel} from "../src/models/user.js";
import validator from "validator";

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {

   try {
      validateSignUpData(req);

      const {
         password,
         firstName,
         lastName,
         age,
         gender,
         emailId,
         skills,
         photoUrl,
         about
      } = req.body;
      const hashedPassword = await UserModel.hashPassword(password);

      const user = new UserModel({
            firstName,
            lastName,
            age,
            gender,
            emailId,
            skills,
            photoUrl,
            about,
            password: hashedPassword
         }
      )
      await user.save();
      res.status(201).json({
         success: 'true',
         message: 'new user created'
      })
   } catch (e) {
      return res.status(400).json({
         success: false,
         message: e.message
      })
   }
})

authRouter.post('/login', async (req, res) => {
   try {
      const {
         emailId,
         password
      } = req.body;
      if (!validator.isEmail(emailId)) {
         return res.status(400).json({
            success: false,
            message: "Enter valid credentials"
         })
      }
      const users = await UserModel.find({emailId})
      if (users?.length === 0) {
         return res.status(400).json({
            success: false,
            message: "Enter valid credentials"
         })
      }
      const isCorrect = await users[0].comparePassword(password);

      if (!isCorrect) {
         return res.status(400).json({
            success: false,
            message: "Enter valid credentials"
         })
      }
      const token = await users[0].generateToken();
      res.cookie("token", token)
      return res.status(200).json({
         success: true,
         message: "login successful"
      })

   } catch (e) {
      return res.status(400).json({
         success: false,
         message: e.message
      })
   }
})

export default authRouter;