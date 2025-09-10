export interface TagForAdminGet {
  id: number;
  name: string;
  isDelete: boolean;
}

export interface AdminGetTagResponse {
  isSuccess: boolean;
  message: string | null;
  data: TagForAdminGet[];
  errorDetail?: string | null;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  id: number;
  name: string;
  isDelete: boolean;
}
