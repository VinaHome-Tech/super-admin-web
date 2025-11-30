import type { ApiResponse } from '@/types/api-response'
import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL,  // lấy từ .env
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ======================
//  REQUEST INTERCEPTOR
// ======================
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ======================
//  RESPONSE INTERCEPTOR
// ======================
http.interceptors.response.use(
  (response) => {
    const raw = response.data as ApiResponse<any>;

    if (raw && typeof raw === "object" && "result" in raw) {
      const formatted: ApiResponse<any> = {
        success: raw.success,
        statusCode: raw.statusCode,
        message: raw.message,
        result: raw.result,
      };
      return formatted;
    }

    return response.data;
  },
  (error) => Promise.reject(error)
);

export default http
