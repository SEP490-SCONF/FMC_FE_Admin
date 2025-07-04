import { apiService } from "../service/ApiService";

export interface GoogleLoginRequest {
  idToken: string;
}

export interface GoogleLoginResponse {
  accessToken?: string;
  expiresAt?: string;
  message?: string;
}

export const adminGoogleLogin = async (idToken: string): Promise<GoogleLoginResponse> => {
  const data = await apiService.post("/AdminLogin/login", { idToken });
  if (data?.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }
  return data;
};