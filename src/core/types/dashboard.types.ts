export interface AdminDashboardStats {
  totalUsers: number;
  totalHouses: number;
  totalBookings: number;
  averageRating: string;
}

export interface DashboardActionResponse {
  success: boolean;
  data?: AdminDashboardStats;
  message?: string;
}