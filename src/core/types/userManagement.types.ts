export type UserRole = "admin" | "buyer" | "seller" | string;

export interface AdminUserItem {
  id: string;
  role: UserRole;
  membershipDate: string | null;
  email: string;
  phoneNumber: string | null;
  emailVerified: boolean;
  verificationCode?: string | null;
  verificationCodeExpires?: string | null;
  resetCode?: string | null;
  resetCodeExpires?: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetAdminUsersResponse {
  data: AdminUserItem[];
  totalCount: number;
}

export interface UpdateAdminUserPayload {
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailVerified: boolean;
  membershipDate: string;
  profilePicture: string;
}

export interface UpdateAdminUserRolePayload {
  role: UserRole;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}