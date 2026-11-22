export interface IDiscountCode {
  id: string;
  house_id: string;
  code: string;
  discount_percentage: string | number;
  valid_until: string;
}

export interface IGetDiscountCodesParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  code?: string;
  discount_percentage?: number | string;
}

export interface IGetDiscountCodesResponse {
  data: IDiscountCode[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface ICreateDiscountCodePayload {
  code: string;
  house_id: number;
  discount_percentage: number;
  valid_until: string;
}

export interface IUpdateDiscountCodePayload {
  id: string | number;
  code: string;
  house_id: number;
  discount_percentage: number;
  valid_until: string;
}