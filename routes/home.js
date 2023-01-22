import express from "express";
import {
  getUser,
  post_getAll,
  post_getOne,
  post_getOnes,
} from "../controllers/homeController.js";

const router = express.Router();

router.get("/", post_getAll);

router.get("/post/:id", post_getOne);
router.get("/:id", post_getOnes);

router.get("/publisheduser/:id", getUser);

export default router;
