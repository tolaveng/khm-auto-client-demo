export interface ResponseResult<T = any> {
    code?: number;
    success: boolean;
    message: string;
    debugMessage?: string;
    data?: T;
}