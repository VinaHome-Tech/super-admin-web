import type { Company } from "@/types/company/company.interface"
import http from "../http"
import type { ApiResponse } from "@/types/api-response"

export const companyService = {

  API_GetAll(): Promise<ApiResponse<Company[]>> {
    return http.get('/v1/super-admin-company/companies')
  },

  API_GetById(id: number) {
    return http.get(`/v1/super-admin-company/companies/${id}`)
  },

  API_Create(data: Company): Promise<ApiResponse<Company>> {
    return http.post('/v1/super-admin-company/companies', data)
  },

  API_Update(id: string, data: Company): Promise<ApiResponse<Company>> {
    return http.put(`/v1/super-admin-company/companies/${id}`, data)
  },

  API_Delete(id: string): Promise<ApiResponse<null>> {
    return http.delete(`/v1/super-admin-company/companies/${id}`)
  }
}
