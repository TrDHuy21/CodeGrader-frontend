export interface LoginRequest {
  userNameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  data: {
    userDto: UserDto;
    tokenDto: TokenDto;
  };
  errorDetail: any; 
}

export interface UserDto {
  id: number;
  userName: string;
  email: string;
  fullName: string;
  avatar: string;
  roleName: string;
  createdAt: string;
}

export interface TokenDto {
  accessToken: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;  
  fullName: string;
}

export interface ApiErrorResponse {
  isSuccess: boolean;
  message: string;
  data: any | null;
  errorDetail: ErrorDetail;
}

export interface ErrorDetail {
  errors: FieldError[];
}

export interface FieldError {
  field: string;
  errorMessage: string;
}

export interface ConfirmEmailRequest 
{
  email: string;
  otp: string;
}

export interface RequestUpdateNewPassword
{
  email: string;
  otp: string;
  newPassword: string;
}
