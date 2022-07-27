import express from "express";
import {
  profile_edit,
  profile_get,
  profile_edit_post,
  updatePost,
  updatePost_get,
  deletePost,
} from "../controllers/userController.js";
import { userImageUpload } from "../utils/imageUpload.js";
import { postImageUpload } from "../utils/postimageupload.js";

const router = express.Router();

router.get("/profile", profile_get);
router.get("/profileedit", profile_edit);
router.post(
  "/profileedit/:id",
  userImageUpload.single("image"),
  profile_edit_post
);

router.get("/postedit/:id", updatePost_get);
router.post("/postedit/:id", postImageUpload.single("image"), updatePost);

router.get("/postdelete/:id", deletePost);

export default router;
