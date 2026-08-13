import type {
  Response,
  NextFunction,
} from "express";

import type {
  AuthenticatedRequest,
} from "../../middleware/auth.middleware.js";

import { conversationService } from "./conversation.service.js";

export async function createConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const conversation = await conversationService.create(
      req.user!.sub,
      req.body,
    );

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
}

export async function listConversations(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const conversations =
      await conversationService.list(req.user!.sub);

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
}

export async function getConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const conversation =
      await conversationService.getById(
        req.user!.sub,
        getConversationId(req),
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

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const conversation =
      await conversationService.update(
        req.user!.sub,
        getConversationId(req),
        req.body,
      );

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    await conversationService.delete(
      req.user!.sub,
      getConversationId(req),
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

function getConversationId(req: AuthenticatedRequest): string {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new Error("Invalid conversation ID");
  }

  return id;
}