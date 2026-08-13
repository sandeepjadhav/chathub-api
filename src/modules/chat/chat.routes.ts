import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { streamMessage } from "./chat.controller.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/conversations/:id/messages/stream",
  streamMessage,
);

export default router;