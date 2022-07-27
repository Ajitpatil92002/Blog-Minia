import express from "express";
import {
  createPost_get,
  createPost_post,
} from "../controllers/blogpostController.js";
import { postImageUpload } from "../utils/postimageupload.js";

const router = express.Router();

router.get("/createpost", createPost_get);

router.post(
  "/createpost/:id",
  postImageUpload.single("image"),
  createPost_post
);

export default router;
