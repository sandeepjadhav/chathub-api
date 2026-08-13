import { AppDataSource } from "../../database/data-source.js";
import { Provider } from "./provider.entity.js";

export const providerRepository =
  AppDataSource.getRepository(Provider);