export interface IHouseParams {
  page?: number;
  limit?: number;
  search?: string;
  order?: "ASC" | "DESC";
  sort?: "last_updated" | "price" | "area" | "created_at";
  propertyType?: string;
  transactionType?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRent?: number;
  maxRent?: number;
  minMortgage?: number;
  maxMortgage?: number;
  minArea?: number;
  maxArea?: number;
}
