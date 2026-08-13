import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import type { AuthTokenPayload } from "../modules/auth/auth.types.js";

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      },
    });

    return;
  }

  const token = authorization.substring("Bearer ".length);

  try {
    const payload = jwt.verify(
      token,
      env.jwtSecret,
    ) as AuthTokenPayload;

    req.user = payload;

    next();
  } catch {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Invalid or expired access token.",
      },
    });
  }
}