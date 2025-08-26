export interface ApiValidationError {
  field: string;
  errorMessage: string;
}
export interface ApiResponse<T = null> {
  isSuccess: boolean;
  message: string | null;
  data: T;
  errorDetail?: { errors: ApiValidationError[] };
}
