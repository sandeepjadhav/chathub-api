import pinoHttp from "pino-http";
import { logger } from "./logger.js";

export const httpLogger = pinoHttp({
  logger,

  customProps: (req) => ({
    requestId: req.headers["x-request-id"],
  }),

  customLogLevel: (_req, res, error) => {
    if (error || res.statusCode >= 500) {
      return "error";
    }

    if (res.statusCode >= 400) {
      return "warn";
    }

    return "info";
  },
});