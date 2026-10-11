export interface Paged<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type QueryValue = string | number | boolean | undefined | null;
export type Query = Record<string, QueryValue>;

export interface SuccessResponse {
  success: boolean;
}
