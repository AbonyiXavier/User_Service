import express from "express";
import cors from "cors";
import logger from "morgan";
import dotenv from "dotenv";

import router from "./routes/index";

require("./config/env.validation"); 

dotenv.config();

const app = express();

app.use(cors());
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Welcome to user service",
  });
});

app.all('*', (req, res) => {
  res.status(404).json({
    status: false,
    message: 'resource not found',
  });
});

export default app;