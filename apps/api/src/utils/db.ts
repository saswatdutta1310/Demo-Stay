import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import * as path from "path";

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
  dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
  if (!process.env.DATABASE_URL) {
    const dbPath = path.resolve(__dirname, "../../prisma/dev.db").replace(/\\/g, "/");
    process.env.DATABASE_URL = `file:${dbPath}`;
  }
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
