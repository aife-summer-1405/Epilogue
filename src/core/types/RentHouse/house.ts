export interface HouseRent  {
  id: string;
  title: string;
  address: string;
  photos: string[];
  rate: string;
  discounted_price: string | null;
  price: string;
  tags: string[];
  last_updated: string;
  capacity: number;
  location: {
    lat: number;
    lng: number;
  };
  categories: {
    name: string;
  };
  bathrooms: number;
  parking: number;
  rooms: number;
  yard_type: string;
  num_comments: number;
  discount_id: number | null;
  transaction_type: string;
  sellerId: string;
  sellerName: string;
  caption: string;
  favoriteId: number | null;
  bookings: number;
  isFavorite: boolean;
}

export interface HousesResponse {
  houses: HouseRent [];
  totalCount: number;
}