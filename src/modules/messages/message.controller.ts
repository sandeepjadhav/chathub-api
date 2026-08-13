import type {
  Response,
  NextFunction,
} from "express";

import type {
  AuthenticatedRequest,
} from "../../middleware/auth.middleware.js";

import { conversationService } from "../conversations/conversation.service.js";
import { messageService } from "./message.service.js";

export async function listMessages(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const conversation =
      await conversationService.getById(
        req.user!.sub,
        req.params.id as string,
      );

    if (!conversation) {
      res.status(404).json({
        success: false,
        error: {
          code: "CONVERSATION_NOT_FOUND",
          message: "Conversation not found.",
        },
      });

      return;
    }

    const messages =
      await messageService.listByConversation(
        conversation.id,
      );

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
}