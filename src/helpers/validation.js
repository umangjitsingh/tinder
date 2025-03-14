import validator from "validator";

export const validateSignUpData = (req) => {
   const {
      firstName,
      lastName,
      emailId,
      password
   } = req.body;
   if (!firstName || !lastName || !emailId || !password) {
      throw new Error("Please fill all the fields")
   } else if (!validator.isEmail(emailId)) {
      throw new Error("Email is not valid")
   } else if (!validator.isStrongPassword(password)) {
      throw new Error("Password is not Strong")
   }
}