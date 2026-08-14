export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
    hasNext: boolean,
    hasPrevious: boolean,
}