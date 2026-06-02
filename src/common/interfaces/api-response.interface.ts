export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: boolean;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
}

// Contract response
// Controller va service tra ve cung 1 format -> cung 1 architecture
