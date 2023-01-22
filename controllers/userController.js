import User from "../models/User.js";
import jwt from "jsonwebtoken";
import blogpost from "../models/blog.js";
import cloudinary from "../utils/cloudinary.js";

export const profile_get = async (req, res) => {
  try {
    const token = req.cookies.Auth_Token;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.render("404");
      } else {
        let user = await User.findById(decodedToken.id);
        let posts = await blogpost.find({ userid: user._id });
        // console.log(post);
        res.render("profile", { user, posts });
      }
    });
  } catch (err) {
    res.status(505).render("505");
  }
};

export const profile_edit = async (req, res) => {
  try {
    const token = req.cookies.Auth_Token;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.render("404");
      } else {
        let user = await User.findByIdAndUpdate(decodedToken.id, req.body);
        res.render("profileform", user);
      }
    });
  } catch (err) {
    res.status(505).render("505");
  }
};

export const profile_edit_post = async (req, res) => {
  try {
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "BlogMinia/user-profiles",
      });

      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: { ...req.body, image: result.secure_url },
        },
        { new: true }
      );
      res.redirect("/user/profile");
    } else {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: { ...req.body },
        },
        { new: true }
      );
      res.redirect("/user/profile");
    }
  } catch (err) {
    console.log(err);
    res.status(505).render("505");
  }
};