import { providerRepository } from "./provider.repository.js";

export class ProviderService {
  async listEnabled() {
    return providerRepository.find({
      where: {
        enabled: true,
      },
      relations: {
        models: true,
      },
      order: {
        name: "ASC",
      },
    });
  }
  
  async getEnabledProviderWithModel(
    providerId: string,
    modelId: string,
  ) {
    const provider = await providerRepository.findOne({
      where: {
        id: providerId,
        enabled: true,
      },
      relations: {
        models: true,
      },
    });

    if (!provider) {
      throw new Error("Provider not found or disabled");
    }

    const model = provider.models.find(
      (item) =>
        item.id === modelId &&
        item.enabled,
    );

    if (!model) {
      throw new Error(
        "Model not found, disabled, or does not belong to provider",
      );
    }

    return {
      provider,
      model,
    };
  }
}



export const providerService = new ProviderService();
