import api from "@/utils/lib/api";
import { LoginCredentials, LoginResponse, LoginUser } from "../types/auth";
import { AxiosError } from "axios";
import { clearAdminSession, setAdminSession } from "@/utils/lib/adminSession";

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  api.defaults.withCredentials = true;
  return api
    .post("/auth/login", { ...credentials })
    .then((response) => response.data)
    .catch((error: AxiosError) => {
      throw new Error(`Falha ao fazer login (${error.response?.status})`);
    });
}

export function setSession(user: { role: string } & Partial<LoginUser>): void {
  if (typeof window === "undefined") return;
  api.defaults.withCredentials = true;
  setAdminSession(user);
}

export async function logout(): Promise<void> {
  clearAdminSession();
  api.defaults.withCredentials = true;
  try {
    await api.post("/auth/logout");
  } catch {
    // Ignore network failures; local state is already cleared
  }
}
