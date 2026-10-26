export type BookCategory = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';
export type BookCategoryFilter = 'Tất cả' | BookCategory;

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  publicationYear: number;
  availableCopies: number;
  totalCopies: number;
  description: string;
  coverImage?: string;
  isbn: string;
}

export type BookSummary = Pick<Book, 'id' | 'title' | 'category' | 'availableCopies'>;
export type CreateBookDTO = Omit<Book, 'id'>;
export type CategoryStatistics = Record<BookCategory, number>;
export type ReadonlyBook = Readonly<Book>;

export interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
  timestamp?: number;
}

export interface ApiErrorResponse {
  ok: false;
  error: string;
  statusCode?: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.ok === true && 'data' in response;
}

export function isErrorResponse<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return response.ok === false && 'error' in response;
}
