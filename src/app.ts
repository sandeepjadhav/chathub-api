import express from "express";
import cors from "cors";

import { API_PREFIX } from "./common/constants/api.constants.js";
import { requestIdMiddleware } from "./middleware/request-id.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

import healthRoutes from "./modules/health/health.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import conversationRoutes
  from "./modules/conversations/conversation.routes.js";
import messageRoutes
  from "./modules/messages/message.routes.js";
import providerRoutes from "./modules/providers/provider.routes.js";
import chatRoutes
  from "./modules/chat/chat.routes.js";
import { httpLogger } from "./common/logger/http-logger.js";


const app = express();

app.use(requestIdMiddleware);
app.use(httpLogger);

app.use(cors());
app.use(express.json());

app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/conversations`, conversationRoutes);
app.use(`${API_PREFIX}/providers`, providerRoutes);
app.use(API_PREFIX, messageRoutes);
app.use(API_PREFIX, chatRoutes);

app.use(errorMiddleware);

export default app;