import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

export const requiredAuth = (req, res, next) => {
  const token = req.cookies.Auth_Token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.redirect("/auth/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/auth/login");
  }
};

//check current user
export const checkUser = (req, res, next) => {
  try {
    const token = req.cookies.Auth_Token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          if(user === null){
            return res.status(505).render("505");
          }
          const { email, username, _id, bio } = user;
          res.locals.user = { email, username, id: _id, bio: bio };
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  } catch (err) {
    return res.status(505).render("505");
  }
};
