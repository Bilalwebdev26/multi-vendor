// packages/libs/prisma/src/index.ts
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config(); // Load env variables first

declare global {
  // Allow reuse of PrismaClient across hot reloads in development
  // eslint-disable-next-line no-var
  var prismaDB: PrismaClient | undefined;
}

// Singleton Prisma Client
export const prisma: PrismaClient =
  globalThis.prismaDB ??
  new PrismaClient({
    log: ["error", "warn"], // optional logs
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaDB = prisma;
}
