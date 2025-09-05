
export interface UserForAdminGet {
  id: number;
  username: string;
  email: string;
  birthday: string; 
  fullName: string;
  isEmailConfirmed: boolean;
  avatar: string;
  bio?: string; 
  githubLink?: string; 
  linkedinLink?: string; 
  isActive: boolean;
  createdAt: string;
}


export interface AdminGetUserResponse {
  isSuccess: boolean;
  message: string;
  data: UserForAdminGet[];
  errorDetail?: string | null; 
}