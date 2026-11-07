export type TransactionType = 'rental' | 'mortgage' | 'reservation' | 'direct_purchase';

export interface Location {
  lat: number;
  lng: number;
}

export interface HouseCategory {
  name: string;
}

export interface SellerHouse {
  id: string;
  title: string;
  address: string;
  photos: string[] | null;
  rate: string;
  discounted_price: number | null;
  price: string;
  tags: string[];
  last_updated: string;
  capacity: number;
  location: Location;
  categories: HouseCategory;
  bathrooms: number;
  parking: number;
  rooms: number;
  yard_type: string;
  num_comments: number;
  discount_id: string | null;
  transaction_type: TransactionType;
  sellerId: string;
  sellerName: string;
  caption: string | null;
}

export interface SellerHouseResponse {
  houses: SellerHouse[];
  totalCount: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface CategoryResponse {
  data: Category[];
  totalCount: number;
}

export interface SellerHouseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  transaction_type?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
}