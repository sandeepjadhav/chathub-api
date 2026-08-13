import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { findUserById, userRepository } from "../users/user.repository.js";
import { env } from "../../config/env.js";
import type {
  AuthTokenPayload,
  LoginRequest,
  RegisterRequest,
} from "./auth.types.js";

export class AuthService {
  
  async register(request: RegisterRequest) {
    const email = request.email.trim().toLowerCase();

    const existingUser = await userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(request.password, 12);

    const user = userRepository.create({
      name: request.name.trim(),
      email,
      passwordHash,
    });

    const savedUser = await userRepository.save(user);

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
    };
  }

  async login(request: LoginRequest) {
    const email = request.email.trim().toLowerCase();

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordValid = await bcrypt.compare(
      request.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new Error("Invalid email or password");
    }

    const payload: AuthTokenPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async getCurrentUser(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
}
}

export const authService = new AuthService();