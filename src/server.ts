import "reflect-metadata";

import app from "./app.js";
import { env } from "./config/env.js";
import { AppDataSource } from "./database/data-source.js";
import { registerProviders } from "./modules/ai/providers/register-providers.js";

async function bootstrap() {
  try {
    await AppDataSource.initialize();

    console.log("PostgreSQL database connected successfully.");

    registerProviders();

    app.listen(env.port, () => {
      console.log(`AI Chat API running on port ${env.port}`);
    });
    
  } catch (error) {
    console.error("Failed to start application:", error);

    process.exit(1);
  }
}

bootstrap();