import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import {
  createConversation,
  deleteConversation,
  getConversation,
  listConversations,
  updateConversation,
} from "./conversation.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createConversation);

router.get("/", listConversations);

router.get("/:id", getConversation);

router.patch("/:id", updateConversation);

router.delete("/:id", deleteConversation);

export default router;