import { STATUS_CODES } from "./statusCodes";

export default class AppError extends Error {
  status: string;
  isOperational: boolean;

  constructor(
    public message: string,
    public statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
