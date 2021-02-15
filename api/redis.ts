import Redis from "ioredis";

export const redis = new Redis(+process.env.REDIS_PORT! || undefined, process.env.REDIS_HOST || undefined);
