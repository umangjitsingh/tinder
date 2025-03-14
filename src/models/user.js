import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
   firstName: {
      type     : String,
      required : true,
      maxLength: 40
   },
   lastName : {
      type     : String,
      maxLength: 40,
      required : true
   },
   emailId  : {
      type     : String,
      unique   : true,
      required : true,
      lowercase: true,
      maxLength: 50,
      trim     : true,
      validate(value) {
         return validator.isEmail(value)
      }
   },
   password : {
      type     : String,
      required : true,
      minLength: [8, "Password must contain minimum of 8 characters."],
      maxLength: 100,
      trim     : true,
      validate : {
         validator: function (value) {
            const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
            return specialCharRegex.test(value)
         },
         message  : `Password must contain at least 1 special character`
      }
   },
   age      : {
      type    : Number,
      min     : 18,
      required: true
   },
   gender   : {
      type    : String,
      required: true,
      enum    : {
         values : ['male', 'female', 'others'],
         message: '{VALUE} is not allowed '
      },
   },
   photoUrl : {
      type   : String,
      default: "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
   },
   about    : {
      type   : String,
      default: "This is a default of the user!"
   },
   skills   : {
      type    : [String],
      validate: {
         validator: function (value) {
            return value.length <= 6;
         },
         message  : `Skills cannot be greater than 6. `
      }
   }
}, {timestamps: true});

userSchema.statics.hashPassword = async function (password) {
   return await bcrypt.hash(password, 10);
}

userSchema.methods.comparePassword = async function(password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateToken = async function(){
   return await jwt.sign({_id: this._id}, process.env.JWT_SECRET,{expiresIn:'7d'});
}

export const UserModel = mongoose.model('User', userSchema)