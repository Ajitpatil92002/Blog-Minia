import express from "express";
import {
  profile_edit,
  profile_get,
  profile_edit_post,
} from "../controllers/userController.js";
import { postImageUploader } from "../utils/postaImageUpload.js";

const router = express.Router();

router.get("/profile", profile_get);

router.get("/profileedit", profile_edit);

router.post(
  "/profileedit/:id",
  postImageUploader.single("image"),
  profile_edit_post
);

export default router;
