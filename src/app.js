import express from 'express';
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import authRouter from "../routes/authRoutes.js";
import profileRouter from "../routes/profileRoutes.js";
import requestsRouter from "../routes/requestsRoutes.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser())
const PORT = process.env.PORT || 4013;

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestsRouter);

connectDB().then(() => {
   console.log("Database connection established");
   app.listen(PORT, () => console.log('server running on', PORT)
   )
}).catch(err => console.log("DB not connected!!", err)
)


