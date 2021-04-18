export interface PageResponse<T = any>
{
    data: T[],
    hasNext?: boolean,
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    error?: string,
    isDownloading?: boolean
}
