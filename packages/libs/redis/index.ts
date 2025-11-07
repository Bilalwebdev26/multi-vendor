import Redis from "ioredis";
import dotenv from "dotenv"
dotenv.config()
export const redis = new Redis(process.env.REDIS_URL as string)
// import pkg from "ioredis";
// import dotenv from "dotenv";
// dotenv.config();

// const Redis = pkg.default; // ✅ this is the actual class constructor
// export const redis = new Redis(process.env.REDIS_URL as string);
