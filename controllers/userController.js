import User from "../models/User.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import blogpost from "../models/post.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

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
      const image = "Userimages/" + req.file.filename;
      const Updatedimage = image.replaceAll(" ", "");
      const OldUser = await User.findById(req.params.id);
      if (OldUser.image != "img/userProfile.png") {
        await fs.unlink(`./static/${OldUser.image}`, (err) => {
          if (err) {
            return res.render("505");
          }
        });
      }
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: { ...req.body, image: Updatedimage },
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

export const updatePost_get = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await blogpost.findById(id);
    res.render("updatePost", { post });
  } catch (err) {
    console.log(err);
    res.render("505");
  }
};

export const updatePost = async (req, res) => {
  try {
    if (req.file) {
      const oldPost = await blogpost.findById(req.params.id);
      await fs.unlink(`./static/${oldPost.image}`, (err) => {
        if (err) {
          console.log(err);
          res.render("505");
          return;
        }
      });
      let image = "Postimages/" + req.file.filename;
      image = image.replaceAll(" ", "");
      const id = req.params.id;
      const post = await blogpost.findByIdAndUpdate(id, {
        $set: { ...req.body, image: image },
      });
      res.redirect("/");
      return;
    } else {
      const id = req.params.id;
      const post = await blogpost.findByIdAndUpdate(id, {
        $set: { ...req.body },
      });
      res.redirect("/");
    }
  } catch (err) {
    if (err.code === 11000) {
      console.log(err);
      return res.status(400).render("ShowError", {
        msg: "Title Must be Unique , Title is Already been Used!",
      });
    }
    res.status(400).render("ShowError", {
      msg: err.message,
    });
    console.log(err);
  }
};

export const deletePost = async (req, res) => {
  try {
    try {
      await blogpost.findByIdAndDelete(req.params.id);
      res.status(200).redirect("/");
    } catch (err) {
      res.status(505).render(505);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
