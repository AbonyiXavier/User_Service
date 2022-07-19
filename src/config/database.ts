import mongoose from "mongoose";
import logger from "./logger";

import dotenv from "dotenv";

dotenv.config();

async function connect() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    logger.info("Database connected successfully");
  } catch (error: any) {
    logger.error("Could not connect to database");
    process.exit(1);
  }
}

export default connect;
