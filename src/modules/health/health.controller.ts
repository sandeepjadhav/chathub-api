import type { Request, Response } from "express";

export function healthCheck(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: {
      status: "healthy",
      service: "ai-chat-api",
      timestamp: new Date().toISOString(),
    },
  });
}