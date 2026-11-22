export interface LocationItem {
  id: string;
  areaName: string;
  lat: string;
  lng: string;
}

export interface GetLocationsResponse {
  data: LocationItem[];
  totalCount: number;
}

export interface GetLocationsParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  area_name?: string;
  lat?: number;
  lng?: number;
}

export interface LocationPayload {
  area_name: string;
  lat: number;
  lng: number;
}