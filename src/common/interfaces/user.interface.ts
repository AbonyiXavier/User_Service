export interface IUserResponse {
    status: string;
    message: string;
    data: Record<string, any> | Record<string, any>[] | null;
}