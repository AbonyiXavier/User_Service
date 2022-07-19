
import { StatusCodes } from "http-status-codes";

export default class AppError extends Error {
  status: string;
  isOperational: boolean;

  constructor(
    public message: string,
    public statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}


