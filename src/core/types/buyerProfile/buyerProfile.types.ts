export interface IBuyerUser {
  id: string;
  role: string;
  membershipDate: string | null;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  fullName: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGetBuyerUserResponse {
  user: IBuyerUser;
  additionalPercentage?: number;
}

export interface IUpdateBuyerUserPayload {
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}