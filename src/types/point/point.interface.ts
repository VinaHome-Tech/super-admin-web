export interface DTO_RQ_Point {
    id?: string;
    status?: PointStatus;
    point_type?: PointType;
    name?: string;
    code?: string;
    address?: string;
    province_id?: string;
    province_code?: string;
    ward_id?: string;
    ward_code?: string;
}

export enum PointType {
    BUS_STATION = "BUS_STATION",
    OFFICE = "OFFICE",
    REST_STOP = "REST_STOP",
    AGENCY = "AGENCY",
    LANDMARK = "LANDMARK",
    AIRPORT = "AIRPORT",
    PORT = "PORT",
    TRAIN_STATION = "TRAIN_STATION",
    AREA = "AREA",
    ON_THE_WAY = "ON_THE_WAY",
}

export enum PointStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}
export interface GlobalPoint {
    id: string;
    name: string;
    code: string;
    status: PointStatus;
    point_type: PointType;
    address: string;
    province: {
        id: string;
        name: string;
    };
    ward: {
        id: string;
        name: string;
    }
}