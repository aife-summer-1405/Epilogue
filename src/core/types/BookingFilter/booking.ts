
export interface TravelerDetails {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  nationalId: string;
}

export interface CreateBookingPayload {
  houseId: number;
  reservedDates: string[];
  traveler_details: TravelerDetails[];
  sharedEmail: string;
  sharedMobile: string;
}

export interface Booking {
  id: number;
  user_id: number;
  houseId: string;
  reservedDates: string[];
  traveler_details: TravelerDetails[];
  status: "pending" | "confirmed" | "cancelled" | string;
  sharedEmail: string;
  sharedMobile: string;
  createdAt: string;
  updatedAt: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingResponse {
  booking: Booking;
}
