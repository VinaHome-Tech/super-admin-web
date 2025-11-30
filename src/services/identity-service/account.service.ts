import type { DTO_RP_Account, DTO_RQ_Account } from "@/types/account/account.interface";
import http from "../http";
import type { ApiResponse } from "@/types/api-response";

export const accountService = {
  API_CreateAdminAccount(companyId: string, data: DTO_RQ_Account): Promise<ApiResponse<DTO_RP_Account>> {
    return http.post(`/v1/super-admin-account/companies/${companyId}/admin-accounts`, data)
  },
  API_GetAdminAccountsByCompany(companyId: string): Promise<ApiResponse<DTO_RP_Account[]>> {
    return http.get(`/v1/super-admin-account/companies/${companyId}/admin-accounts`)
  },
  API_DeleteAdminAccount(accountId: string): Promise<ApiResponse<void>> {
    return http.delete(`/v1/super-admin-account/${accountId}/admin-accounts`)
  },
  API_UpdateAdminAccount(companyId: string, data: DTO_RQ_Account): Promise<ApiResponse<DTO_RP_Account>> {
    return http.put(`/v1/super-admin-account/${companyId}/admin-accounts`, data)
  }
}