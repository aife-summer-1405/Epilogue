export interface UserDto {
  id: string;
  role: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  fullName: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  membershipDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserResponse {
  user: UserDto;
  additionalPercentage: number;
}
