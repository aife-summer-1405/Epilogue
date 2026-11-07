export interface AddHouseFormData {
  title: string;
  address: string;
  rate: number;
  price: number;
  tags: string[];
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
  transaction_type: "rental" | "mortgage" | "reservation" | "direct_purchase";
  caption: string | null;
}