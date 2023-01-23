import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import homeRoute from "./routes/home.js";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import blogRoute from "./routes/blog.js";
import { checkUser, requiredAuth } from "./middlewares/authMiddleware.js";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

// DataBase Connection
mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("DB is Connected");
  }
});

// Configuration setup Middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./static"));
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

//Routes
app.get("*", checkUser);
app.use("/", checkUser, homeRoute);
app.use("/auth", checkUser, authRoute);
app.use("/user", checkUser, requiredAuth, userRoute);
app.use("/blog", checkUser, requiredAuth, blogRoute);

app.listen(PORT, () => console.log("App is Running"+PORT));
