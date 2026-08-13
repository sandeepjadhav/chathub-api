import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { listProviders } from "./provider.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listProviders);

export default router;
