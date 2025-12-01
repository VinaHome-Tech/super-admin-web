export interface DTO_RQ_Route {
  id?: string;
  route_name?: string;
  short_name?: string;
  base_price?: number;
  route_name_e_ticket?: string;
  e_ticket_price?: number;
  distance?: number;
  journey?: string;
  note?: string;
  status?: boolean;
}
export interface DTO_RP_Route {
  id: string;
  route_name?: string;
  short_name?: string;
  base_price?: number;
  route_name_e_ticket?: string;
  e_ticket_price?: number;
  distance?: number;
  journey?: string;
  note?: string;
  status?: boolean;
  display_order?: number;
}