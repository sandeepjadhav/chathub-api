import { AIModel } from "../../modules/providers/model.entity.js";
import { Provider } from "../../modules/providers/provider.entity.js";
import { AppDataSource } from "../data-source.js";


const providerSeeds = [
  {
    name: "openrouter",
    displayName: "OpenRouter",
    type: "cloud",
    enabled: true,

    models: [
      {
        name: "openai/gpt-oss-20b:free",
        displayName: "GPT OSS 20B",
        contextWindow: 131072,
        enabled: true,
      },
    ],
  },

  // Add future providers here
  //
  // {
  //   name: "gemini",
  //   displayName: "Google Gemini",
  //   type: "cloud",
  //   enabled: true,
  //   models: [
  //     {
  //       name: "gemini-2.5-flash",
  //       displayName: "Gemini 2.5 Flash",
  //       contextWindow: 1048576,
  //       enabled: true,
  //     },
  //   ],
  // },
];

async function seed() {
  try {
    await AppDataSource.initialize();

    console.log("🌱 Starting database seed...");

    const providerRepository =
      AppDataSource.getRepository(Provider);

    const modelRepository =
      AppDataSource.getRepository(AIModel);

    for (const providerData of providerSeeds) {
      let provider = await providerRepository.findOne({
        where: {
          name: providerData.name,
        },
      });

      if (!provider) {
        provider = providerRepository.create({
          name: providerData.name,
          displayName: providerData.displayName,
          type: providerData.type,
          enabled: providerData.enabled,
        });

        provider = await providerRepository.save(provider);

        console.log(
          `✓ Provider created: ${provider.displayName}`,
        );
      } else {
        provider.displayName = providerData.displayName;
        provider.type = providerData.type;
        provider.enabled = providerData.enabled;

        provider = await providerRepository.save(provider);

        console.log(
          `↻ Provider updated: ${provider.displayName}`,
        );
      }

      for (const modelData of providerData.models) {
        let model = await modelRepository.findOne({
          where: {
            providerId: provider.id,
            name: modelData.name,
          },
        });

        if (!model) {
          model = modelRepository.create({
            providerId: provider.id,
            name: modelData.name,
            displayName: modelData.displayName,
            contextWindow: modelData.contextWindow,
            enabled: modelData.enabled,
          });

          await modelRepository.save(model);

          console.log(
            `  ✓ Model created: ${modelData.displayName}`,
          );
        } else {
          model.displayName = modelData.displayName;
          model.contextWindow =
            modelData.contextWindow;
          model.enabled = modelData.enabled;

          await modelRepository.save(model);

          console.log(
            `  ↻ Model updated: ${modelData.displayName}`,
          );
        }
      }
    }

    console.log("🌱 Database seed completed.");
  } catch (error) {
    console.error("❌ Database seed failed:", error);

    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seed();