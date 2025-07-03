import axios, { AxiosRequestConfig, AxiosError } from "axios";

const API_DOMAIN_URL = import.meta.env.VITE_API_DOMAIN_URL;
class ApiService {
  api: any;
  constructor() {
    this.api = axios.create({
      baseURL: API_DOMAIN_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Để gửi cookie khi gọi API
    });
    this.api.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = localStorage.getItem("accessToken");
        if (!config.headers) config.headers = {}; // Thêm dòng này

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
          config.headers["Content-Type"] = "multipart/form-data";
        } else {
          config.headers["Content-Type"] = "application/json";
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );
  }

  async request(
    method: string,
    endpoint: string,
    options: { [key: string]: any; _retry?: boolean } = {}
  ): Promise<any> {
    try {
      if (!endpoint) {
        throw new Error("invalid endpoint");
      }
      const response = await this.api.request({
        method,
        url: endpoint,
        ...options,
      });
      return response.data;
    } catch (error: any) {
      // Nếu lỗi 401, thử refresh token qua cookie HttpOnly
      if (error.response && error.response.status === 401 && !options._retry) {
        try {
          // Gọi API refresh token, cookie sẽ tự động gửi lên
          const refreshRes = await this.api.post(
            "/GoogleLogin/RefreshToken",
            {},
            { withCredentials: true }
          );
          const { accessToken: newAccessToken } = refreshRes.data;
          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            // Retry request cũ với accessToken mới
            return await this.request(method, endpoint, {
              ...options,
              _retry: true,
            });
          }
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          window.location.href = "/auth/login";
          throw refreshError;
        }
      }
      this.handleError(error);
    }
  }

  async get(endpoint: string, params = {}) {
    return this.request("get", endpoint, { params });
  }
  async post(endpoint: string, data: any) {
    return this.request("post", endpoint, { data });
  }
  async put(endpoint: string, data: any) {
    return this.request("put", endpoint, { data });
  }
  async delete(endpoint: string) {
    return this.request("delete", endpoint);
  }

  handleError(error: any) {
    console.error("❌ API Call Failed:", error);

    if (error.response) {
      console.error("⚠️ Response Data:", error.response.data);
      console.error("🔴 Status Code:", error.response.status);
      console.error("📩 Headers:", error.response.headers);
      // Throw the original error to preserve all response data
      throw error;
    } else if (error.request) {
      console.error("🚫 No response received from server", error.request);
      throw error;
    } else {
      console.error("⚙️ Request setup error:", error.message);
      throw error;
    }
  }
}

const apiService = new ApiService();

export { apiService, ApiService };