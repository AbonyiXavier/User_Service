import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import { STATUS_CODES } from "./common/utils/statusCodes";
import { statusError, statusSuccess } from "./common/constant/constant";

import router from "./routes/index";

dotenv.config();

require("./config/env.validation");

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.status(STATUS_CODES.OK).json({
    status: statusSuccess,
    message: "Welcome to user service 👈👈",
  });
});

app.all("*", (req: Request, res: Response) => {
  res.status(STATUS_CODES.NOT_FOUND).json({
    status: statusError,
    message: "resource not found",
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
