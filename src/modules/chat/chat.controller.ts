import type {
  Response,
  NextFunction,
} from "express";

import type {
  AuthenticatedRequest,
} from "../../middleware/auth.middleware.js";

import { chatService } from "./chat.service.js";

export async function streamMessage(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const conversationId = req.params.id;

    if (typeof conversationId !== "string") {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_CONVERSATION_ID",
          message: "Invalid conversation ID.",
        },
      });

      return;
    }

    const { content, providerId, modelId } =
      req.body;

    if (
      typeof content !== "string" ||
      !content.trim()
    ) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_MESSAGE",
          message: "Message content is required.",
        },
      });

      return;
    }

    res.status(200);

    res.setHeader(
      "Content-Type",
      "text/event-stream",
    );

    res.setHeader(
      "Cache-Control",
      "no-cache",
    );

    res.setHeader(
      "Connection",
      "keep-alive",
    );

    res.flushHeaders();

    await chatService.streamMessage(
      req.user!.sub,
      conversationId,
      {
        content: content.trim(),
        providerId,
        modelId,
      },
      (chunk) => {
        res.write(
          `data: ${JSON.stringify({
            type: "token",
            content: chunk,
          })}\n\n`,
        );
      },
    );

    res.write(
      `data: ${JSON.stringify({
        type: "done",
      })}\n\n`,
    );

    res.end();
  } catch (error) {
    if (!res.headersSent) {
      next(error);
      return;
    }

    res.write(
      `data: ${JSON.stringify({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Chat failed",
      })}\n\n`,
    );

    res.end();
  }
}
