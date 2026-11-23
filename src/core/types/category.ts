export interface Category {
  id: string;
  name: string;
}

export interface CategoriesListResponse {
  data: Category[];
  totalCount: number;
}

export interface CategoryFilters {
  page: number;
  limit: number;
  sort: string;
  order: "ASC" | "DESC";
  name: string;
}

export interface CategoryMutationPayload {
  name: string;
}