import blogpost from "../models/post.js";
import User from "../models/User.js";

export const post_getAll = async (req, res) => {
  try {
    const posts = await blogpost
      .find()
      .populate("userid")
      .sort({ createdAt: "desc" });
    res.render("index", { posts });
  } catch (err) {
    console.log(err);
    res.render("505");
  }
};

export const post_getOne = async (req, res) => {
  try {
    const post = await blogpost.findById(req.params.id).populate("userid");
    res.status(200).render("viewpost", { post });
  } catch (err) {
    console.log(err);
    res.status(404).render("404");
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const posts = await blogpost
      .find({ userid: user.id })
      .populate("userid")
      .sort({ createdAt: "desc" });
    res.render("userprofile", { userDetails : user, posts });
  } catch (err) {
    res.render("404");
  }
};
