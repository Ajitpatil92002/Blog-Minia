import express from "express";
import {
  register_get,
  register_post,
  verifyAccount,
  login_get,
  login_post,
  forgetpassword_get,
  forgetpassword_post,
  resetPassword_get,
  resetPassword_post,
  logout_get,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/register", register_get);
router.post("/register", register_post);

router.get("/verifyemail", (req, res) => {
  res.render("verifyemail");
});
router.get("/verifyAccount/:token/:id", verifyAccount);

router.get("/login", login_get);
router.post("/login", login_post);

router.get("/forgetpassword", forgetpassword_get);
router.post("/forgetpassword", forgetpassword_post);

router.get("/resetpassword/:token/:id", resetPassword_get);
router.post("/resetpassword/:token/:id", resetPassword_post);

router.get("/logout", logout_get);

export default router;
