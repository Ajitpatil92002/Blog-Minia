import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { isEmailValid } from "../utils/validEmail.js";
import { sendRestPasswordMail, sendVerifyEmail } from "../utils/sendEmails.js";
import { handleError } from "../utils/handleerror.js";

const maxAge = (3 / 24) * 60 * 60;
export const register_get = (req, res) => {
  res.render("signup");
};

export const register_post = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { valid } = await isEmailValid(email);
    if (valid) {
      const user = new User({
        email,
        username,
        password,
        image: "img/userProfile.png",
      });
      await user.save();
      const authVerifytoken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET + user.password,
        { expiresIn: "1h" }
      );
      sendVerifyEmail(authVerifytoken, email, user._id);
      res.status(200).json({ msg: "/auth/verifyemail" });
    } else {
      const errors = {
        email: "Enter valid email",
      };
      res.status(400).json({ errors });
    }
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

export const verifyAccount = async (req, res) => {
  const { token, id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, {
      $set: {
        isVerified: true,
      },
    });
    if (!user) {
      return res.status(404).render("404");
    }
    jwt.verify(token, process.env.JWT_SECRET + user.password);
    res.render("verifyAccount");
  } catch (err) {
    res.status(404).render("404");
  }
};

export const login_get = async (req, res) => {
  res.status(200).render("login");
};

export const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const UserVerify = await User.findOne({ email });
    if (UserVerify) {
      if (UserVerify.isVerified === false) {
        let errors = {
          username: "",
          email: "Please enter valid email",
          password: "",
        };
        return res.render("login", { errors });
      }
    }
    const user = await User.login(email, password);
    const Token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("Auth_Token", Token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.user = user._id;
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    // res.render("login", { errors });
    res.status(400).json({ errors });
  }
};

export const forgetpassword_get = async (req, res) => {
  res.render("forgetpassword");
};

export const forgetpassword_post = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
      res.send({ msg: "You Email is not register ,Please SignIN" });
      return;
    }
    const { _id } = user;
    const Token = jwt.sign({ _id }, process.env.JWT_SECRET + user.password, {
      expiresIn: "1h",
    });
    sendRestPasswordMail(Token, user.email, _id);
    res.status(200).json({
      msg: `Please, Reset your Password link has been Sent to your Gmail Account :- ${user.email}`,
    });
  } catch (err) {
    res.status(400).json({ msg: "You Email is not register ,Please SignIN" });
  }
};

export const resetPassword_get = async (req, res) => {
  const { token, id } = req.params;
  try {
    const user = await User.findById(id);
    jwt.verify(token, process.env.JWT_SECRET + user.password);
    res.render("resetpassword", { email: user.email });
  } catch (err) {
    res.status(505).render("505");
  }
};

export const resetPassword_post = async (req, res) => {
  try {
    const { token, id } = req.params;
    const user = await User.findById(id);
    jwt.verify(token, process.env.JWT_SECRET + user.password);
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(id, {
      $set: {
        password: hashpassword,
      },
    });
    res.status(200).json({ msg: "Password is Reseted" });
  } catch (err) {
    res.status(505).render("505");
  }
};

export const logout_get = (req, res) => {
  res.cookie("Auth_Token", "", { maxAge: 1 });
  res.redirect("/");
};