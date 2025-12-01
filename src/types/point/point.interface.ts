export interface DTO_RQ_Point {
    id?: string;
    name?: string;
    code?: string;
    address?: string;
    province_id?: string;
    province_code?: string;
    ward_id?: string;
    ward_code?: string;
}
export interface GlobalPoint {
    id: string;
    name: string;
    code: string;
    address: string;
    province: {
        id: string;
        name: string;
        province_code: string;
    };
    ward: {
        id: string;
        name: string;
        ward_code: string;
    }
}