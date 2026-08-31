import express from "express";
import { getUsers, updateUserRole } from "../controllers/userController.js";
import { isAuth } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.use(isAuth, authorize("admin"));

router.get("/", getUsers);
router.put("/:id/role", updateUserRole);

export default router;
