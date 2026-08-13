import { providerRegistry } from "../provider.registry.js";
import { OpenRouterProvider } from "./openrouter.provider.js";

export function registerProviders() {
  providerRegistry.register(
    new OpenRouterProvider(),
  );
}
