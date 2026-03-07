import { apiRequest } from "./client";
import type { LoginRequest, RegisterRequest, TokenResponse, User } from "../types/auth";

export function registerUser(payload: RegisterRequest): Promise<User> {
  return apiRequest<User>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function loginUser(payload: LoginRequest): Promise<TokenResponse> {
  return apiRequest<TokenResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function getCurrentUser(token: string): Promise<User> {
  return apiRequest<User>("/auth/me", {
    token,
  });
}