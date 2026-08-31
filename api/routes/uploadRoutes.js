import express from "express";
import upload from "../middleware/upload.js";
import { uploadImage } from "../controllers/uploadController.js";
import { isAuth } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.post(
  "/",
  isAuth,
  authorize("admin"),
  upload.single("image"),
  uploadImage,
);

export default router;
