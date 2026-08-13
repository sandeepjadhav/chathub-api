import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  base: {
    service: "ai-chat-api",
  },

  timestamp: pino.stdTimeFunctions.isoTime,
});