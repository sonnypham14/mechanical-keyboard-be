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
  