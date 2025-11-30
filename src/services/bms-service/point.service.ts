import type { ApiResponse } from "@/types/api-response"
import http from "../http"
import type { Province } from "@/types/point/province.interface"
import type { Ward } from "@/types/point/ward.interface"
import type { DTO_RQ_Point, GlobalPoint } from "@/types/point/point.interface"

export const pointService = {

  API_GetAllProvince(): Promise<ApiResponse<Province[]>> {
    return http.get('/v2/super-admin-point/provinces')
  },
  API_GetWardsByProvinceCode(province_code: string): Promise<ApiResponse<Ward[]>> {
    return http.get(`/v2/super-admin-point/provinces/${province_code}/wards`)
  },
  API_CreateGlobalPoint(data: DTO_RQ_Point): Promise<ApiResponse<DTO_RQ_Point>> {
    return http.post('/v2/super-admin-point/global-points', data) 
  },
  API_GetAllGlobalPoints(): Promise<ApiResponse<GlobalPoint[]>> {
    return http.get('/v2/super-admin-point/global-points')
  },
  API_UpdateGlobalPoint(pointId: string, data: DTO_RQ_Point): Promise<ApiResponse<DTO_RQ_Point>> {
    return http.put(`/v2/super-admin-point/global-points/${pointId}`, data)
  }
}