import { createClient } from 'redis';
import logger from '../../config/logger';

const redisUrl = `${process.env.REDIS_URL}`;
const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info("Redis client connected...");
  } catch (error: any) {
    logger.error(error.message);
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

redisClient.on('error', (error) =>  logger.error(error));

export default redisClient;