import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";
import { isAuth } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", isAuth, (req, res) => res.json(req.user));

export default router;
