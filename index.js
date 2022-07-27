import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.js";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import blogpostRoute from "./routes/blogpost.js";
import { checkUser, requiredAuth } from "./middlewares/authMiddleware.js";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("DB is Connected");
  }
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./static"));

app.get("*", checkUser);
app.use("/", checkUser, postRoute);
app.use("/auth", checkUser, authRoute);
app.use("/user", checkUser, requiredAuth, userRoute);
app.use("/blogpost", checkUser, requiredAuth, blogpostRoute);

app.listen(PORT, () => console.log("App is Running"));
