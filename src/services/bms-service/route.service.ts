import type { ApiResponse } from "@/types/api-response"
import http from "../http"
import type { DTO_RP_Route, DTO_RQ_Route } from "@/types/route/route.interface"

export const routeService = {
    API_GetRoutesByCompanyId(companyId: string): Promise<ApiResponse<DTO_RP_Route[]>> {
        return http.get(`/v2/super-admin-route/companies/${companyId}/routes`)
    },
    API_UpdateRoute(routeId: string, data: DTO_RQ_Route): Promise<ApiResponse<DTO_RP_Route>> {
        return http.put(`/v2/super-admin-route/routes/${routeId}`, data)
    },
    API_CreateRoute(companyId: string, data: DTO_RQ_Route): Promise<ApiResponse<DTO_RP_Route>> {
        return http.post(`/v2/super-admin-route/companies/${companyId}/routes`, data)
    },
    API_DeleteRoute(routeId: string): Promise<ApiResponse<null>> {
        return http.delete(`/v2/super-admin-route/routes/${routeId}`)
    }
}