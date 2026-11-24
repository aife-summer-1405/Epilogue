export type SellerUpgradeStatus = "pending" | "approved" | "rejected";

export interface SellerUpgradeApplicant {
  id: string;
  email: string;
  fullName?: string | null;
  phoneNumber?: string | null;
  role?: string | null;
}

export interface SellerUpgradeRequest {
  id: string;
  userId: string;
  message?: string | null;
  status: SellerUpgradeStatus | string;
  reviewedBy?: string | null;
  adminNote?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  user?: SellerUpgradeApplicant | null;
}

export interface SellerUpgradeRequestsResponse {
  totalCount: number;
  requests: SellerUpgradeRequest[];
  currentPage: number;
  totalPages: number;
}

export interface SellerUpgradeFilters {
  status: "" | SellerUpgradeStatus;
  page: number;
  limit: number;
}

export interface ReviewSellerUpgradePayload {
  id: string;
  adminNote: string;
}