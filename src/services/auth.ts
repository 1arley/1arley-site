import api from "@/utils/lib/api";
import { LoginCredentials, LoginResponse } from "../types/auth";
import { AxiosError } from "axios";

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  api.defaults.withCredentials = true;
  return api
    .post("/auth/login", { ...credentials })
    .then((response) => response.data)
    .catch((error: AxiosError) => {
      throw new Error(`Falha ao fazer login (${error.response?.status})`);
    });
}

export function setSession(token: string, user: { role: string }) {
  if (typeof window === "undefined") return;
  api.defaults.withCredentials = true;
  window.sessionStorage.setItem("adminAuthToken", token);
  window.sessionStorage.setItem("adminUser", JSON.stringify(user));
  window.sessionStorage.setItem("adminRole", user.role);
}
