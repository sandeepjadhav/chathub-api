import { AppDataSource } from "../../database/data-source.js";
import { User } from "./user.entity.js";

export const userRepository = AppDataSource.getRepository(User);

export async function findUserById(id: string) {
  return userRepository.findOne({
    where: { id },
  });
}