import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";
const requiredEnv = [
  "DATABASE_URL",
  "JWT_SECRET",
  "OPENROUTER_API_KEY",
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env: {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: SignOptions["expiresIn"];
  openRouterApiKey: string;
  openRouterBaseUrl: string;
} = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"],
  openRouterApiKey: process.env.OPENROUTER_API_KEY!,
  openRouterBaseUrl: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
};