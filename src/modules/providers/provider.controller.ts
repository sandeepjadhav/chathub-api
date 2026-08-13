import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { providerService } from "./provider.service.js";

export async function listProviders(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const providers =
      await providerService.listEnabled();

    res.status(200).json({
      success: true,
      data: providers,
    });
  } catch (error) {
    next(error);
  }
}