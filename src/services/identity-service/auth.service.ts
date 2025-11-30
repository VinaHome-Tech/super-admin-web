import http from "../http";

export const authService = {
  API_Login(data: { email: string; password: string }) {
    return http.post('/auth/login', data)
  },

  API_Logout() {
    return http.post('/auth/logout')
  }
}