import { apiClient } from "./apiClient";
import type { AuthSession, LoginRequest, RegisterRequest } from "../types/auth";

interface BackendAuthResponse {
  access_token: string;
  token_type: "bearer";
  user: {
    id: number;
    full_name: string;
    email: string;
    role: "customer" | "admin";
  };
}

function mapAuth(response: BackendAuthResponse): AuthSession {
  return {
    token: response.access_token,
    user: {
      id: String(response.user.id),
      name: response.user.full_name,
      email: response.user.email,
      role: response.user.role,
    },
  };
}

export async function login(payload: LoginRequest): Promise<AuthSession> {
  const response = await apiClient.post<BackendAuthResponse>("/api/auth/login", payload);
  return mapAuth(response);
}

export async function register(payload: RegisterRequest): Promise<AuthSession> {
  const response = await apiClient.post<BackendAuthResponse>("/api/auth/register", {
    full_name: payload.name,
    email: payload.email,
    password: payload.password,
    phone: payload.phone,
  });
  return mapAuth(response);
}
