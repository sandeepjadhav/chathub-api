import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { listMessages } from "./message.controller.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/conversations/:id/messages",
  listMessages,
);

export default router;