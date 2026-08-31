import express from "express";
import { isAuth } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import {
  getConversation,
  getMessages,
  getAdminConversations,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/admin/conversations", isAuth, authorize("admin"), getAdminConversations);
router.get("/:userId", isAuth, getConversation);
router.get("/messages/:conversationId", isAuth, getMessages);

export default router;
