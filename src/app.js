import express from 'express';
import connectDB from "./config/database.js";
import {UserModel} from "./models/user.js";
import {validateSignUpData} from "./helpers/validation.js";
import validator from "validator";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"

dotenv.config();
import {userAuth} from "../middlewares/auth.js";

const app = express();

app.use(express.json());
app.use(cookieParser())
const PORT = process.env.PORT || 4013

app.post('/signup', async (req, res) => {

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

app.post('/login', async (req, res) => {
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

app.post('/sendFriendRequest', userAuth, async (req, res) => {
   const user = req.user;
   res.send(`${user.firstName} ${user.lastName} is sending a friend request`)
})

app.get('/profile', userAuth, async (req, res) => {
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

app.get('/user', async (req, res) => {
   try {
      const {emailId} = req.body;
      const user = await UserModel.find({emailId});
      if (!user) {
         res.status(404).json({
            success: false,
            message: "User not found."
         })
      }
      res.status(200).json({
         success: true,
         data   : user
      })
   } catch (e) {
      res.status(400).json({
         success: false,
         message: "something went wrong"
      })
   }

})

app.get('/all', async (req, res) => {
   try {
      const allUsers = await UserModel.find({});
      console.log(allUsers);

      return res.status(200).json({
         success: true,
         data   : allUsers
      })
   } catch (e) {
      return res.status(400).send("something went wrong",)
   }
})

app.delete('/user', async (req, res) => {
   const {emailId} = req.body;
   if (!emailId) return res.status(400).json({
      success: false,
      message: "Please enter you email id"
   });
   try {
      const user = await UserModel.findOneAndDelete({emailId});
      console.log(user + "is deleted from DB");
      return res.status(200).json({
         success: true,
         message: "User Deleted"
      })
   } catch (e) {
      return res.status(400).send("something went wrong.",)
   }
})

app.patch('/user', async (req, res) => {
      const {
         firstName,
         lastName,
         age,
         gender,
         emailId,
         skills,
         photoUrl,
         about
      } = req.body;
      if (!emailId) return res.status(400).json({
         success: false,
         message: "Please enter you email id"
      });
      try {
         const user = await UserModel.findOneAndUpdate({emailId}, {
                  firstName,
                  lastName,
                  age,
                  gender,
                  skills,
                  photoUrl,
                  about
               }, {runValidators: true}
            )
         ;
         if (user === null) {
            return res.status(400).json({
               success: false,
               message: "You can't edit your email."
            })
         }
         console.log(user + "is edited from DB");
         return res.status(200).json({
            success: true,
            message: "User Edited"
         })
      } catch
         (e) {
         return res.status(400).json({
            success: false,
            message: e.message

         })
      }
   }
)

connectDB().then(() => {
   console.log("Database connection established");
   app.listen(PORT, () => console.log('server running on', PORT)
   )
}).catch(err => console.log("DB not connected!!", err)
)


