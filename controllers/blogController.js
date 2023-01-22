import BlogModel from "../models/blog.js";
import cloudinary from "../utils/cloudinary.js";

export const Get_ALL_blogs = async (req, res) => {
  try {
    const { limit = 10, page = 0 } = req.query;
    const all_Blogs = await BlogModel.find().limit(limit).skip(page);
    res.json({
      status: true,
      data: { blogs: all_Blogs },
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      msg: err.message,
      err,
    });
  }
};

export const Get_Blog_by_slug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await BlogModel.findOne({ slug });
    if (!blog) {
      throw Error("Blog not found !!");
    }
    res.json({
      status: true,
      data: { blog },
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      msg: err.message,
    });
  }
};

export const create_Blog_get = async (req, res) => {
  res.render("addpost");
};

export const create_Blog_post = async (req, res) => {
  try {
    const foundBlog = await BlogModel.find({ title: req.body.title });
    if (foundBlog.length === 0) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "BlogMinia",
      });
      const userid = req.params.id;
      const newBlog = new BlogModel({
        ...req.body,
        userid,
        image: result.secure_url,
        cloudinary_id: result.public_id,
      });
      const createdBlog = await newBlog.save();
      res.redirect("/");
    } else {
      console.log(foundBlog);
      throw new Error("Blog with same content is Already Present");
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

export const edit_Blog_get = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await BlogModel.findById(id);
    res.render("updatepost", { post });
  } catch (err) {
    console.log(err);
    res.render("505");
  }
};

export const edit_Blog_post = async (req, res) => {
  try {
    if (req.file) {
      const edit_blog = await BlogModel.findById(req.params.id);
      if (!edit_blog) {
        throw new Error("Blog Not found");
      }
      await cloudinary.v2.uploader.destroy(edit_blog.cloudinary_id);
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "BlogMinia",
      });
      req.body.image = result.secure_url;
      req.body.cloudinary_id = result.public_id;
    }
    const edited_blog = await BlogModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!edited_blog) {
      throw new Error("Blog Not found");
    }

    res.redirect("/");
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

export const delete_Blog = async (req, res) => {
  try {
    const delete_Blog = await BlogModel.findByIdAndDelete(req.params.id);
    await cloudinary.v2.uploader.destroy(delete_Blog.cloudinary_id);
    if (!delete_Blog) {
      throw new Error("Blog Not Found");
    }
    res.status(200).redirect("/");
  } catch (err) {
    console.log(err);
    res.status(400).render("ShowError", {
      msg: err.message,
    });
  }
};
