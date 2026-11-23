export type AdminBookingStatus =
  | "pending"
  | "confirmed"
  | "canceled"
  | "completed"
  | string;

export interface TravelerDetailItem {
  firstName: string;
  lastName: string;
  gender: "male" | "female" | string;
  birthDate: string;
  nationalId: string;
}

export interface AdminBookingItem {
  id: number;
  user_id: number;
  houseId: string;
  reservedDates: string[];
  traveler_details: TravelerDetailItem[];
  status?: AdminBookingStatus;
  sharedEmail?: string;
  sharedMobile?: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminBookingsListResponse {
  data: AdminBookingItem[];
  totalCount: number;
}

export interface AdminBookingsQueryParams {
  page: number;
  limit: number;
  sort?: "createdAt" | "id" | string;
  order?: "ASC" | "DESC";
  status?: string;
  user_id?: string;
  house_id?: string;
}

export interface UpdateAdminBookingPayload {
  id: number;
  houseId: number;
  reservedDates: string[];
  traveler_details: TravelerDetailItem[];
  status: string;
  sharedEmail: string;
  sharedMobile: string;
}