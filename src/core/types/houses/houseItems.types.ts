export interface IHouseItem {
  id: string | number;
  title: string;
  address: string;
  rate?: number;
  rating?: number;
  photos: string[];
  image?: string;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  capacity?: number;
  guests?: number;
  parking?: number;
  price?: number | string;
  rent?: number | string;
  discounted_price?: number | string;
  discount?: number;
}
