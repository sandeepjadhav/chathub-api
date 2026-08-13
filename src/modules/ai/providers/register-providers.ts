import { providerRegistry } from "./provider.registry.js";
import { OllamaProvider } from "./ollama/ollama.provider.js";
import { OpenRouterProvider } from "./openrouter/openrouter.provider.js";

export function registerProviders() {
  providerRegistry.register(
    new OllamaProvider(),
  );
  providerRegistry.register(
    new OpenRouterProvider(),
  );
}