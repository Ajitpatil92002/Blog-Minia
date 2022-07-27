import express from "express";
import {
  getUser,
  post_getAll,
  post_getOne,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", post_getAll);

router.get("/post/:id", post_getOne);

router.get("/publisheduser/:id", getUser);

export default router;
