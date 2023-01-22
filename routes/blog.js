import express from "express";
import {
  create_Blog_get,
  create_Blog_post,
  delete_Blog,
  edit_Blog_get,
  edit_Blog_post,
} from "../controllers/blogController.js";
import { postImageUploader } from "../utils/postaImageUpload.js";

const router = express.Router();

router.get("/create-post", create_Blog_get);

router.post(
  "/create-post/:id",
  postImageUploader.single("image"),
  create_Blog_post
);

router.get("/edit-post/:id", postImageUploader.single("image"), edit_Blog_get);

router.post("/edit-post/:id", postImageUploader.single("image"), edit_Blog_post);

router.get("/delete-post/:id", delete_Blog);

export default router;
