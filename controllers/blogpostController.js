import blogpost from "../models/post.js";

export const createPost_get = async (req, res) => {
  res.render("addpost");
};

export const createPost_post = async (req, res) => {
  try {
    let image = "";
    if (req.file) {
      image = "Postimages/" + req.file.filename;
      image = image.replaceAll(" ", "");
    }
    const userid = req.params.id;
    const post = await new blogpost({ ...req.body, userid, image });
    await post.save();
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
