import { Redis } from "ioredis";
import logger from "../utils/logger";

class Ioredis {
  private static DELAY_UPPER_LIMIT_IN_MILLIESECONDS = 2000;
  private static instance: Ioredis | null = null;
  public redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      retryStrategy(times) {
        const delay = Math.min(
          times * 50,
          Ioredis.DELAY_UPPER_LIMIT_IN_MILLIESECONDS
        );
        return delay;
      },
    });
    this.redisEventListeners();
  }

  private redisEventListeners() {
    this.redis.on("connect", () => {
      logger.info("Connected to Redis");
    });

    this.redis.on("error", (err) => {
      logger.error("Redis connection error:", err);
    });

    this.redis.on("reconnecting", () => {
      logger.warn("Reconnecting to Redis...");
    });

    this.redis.on("end", () => {
      logger.error("Redis connection closed");
    });
  }

  public static getInstance(): Ioredis {
    if (!Ioredis.instance) {
      Ioredis.instance = new Ioredis();
    }
    return Ioredis.instance;
  }

  public getClient(): Redis {
    return this.redis;
  }
}

const redisInstance = Ioredis.getInstance();
export default redisInstance;
