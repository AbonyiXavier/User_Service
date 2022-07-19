export interface IAlphinResponse {
    status: string;
    message: string;
    data: Record<string, any> | Record<string, any>[] | null;
}