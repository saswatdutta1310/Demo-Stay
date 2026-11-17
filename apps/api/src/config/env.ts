import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

if (!process.env.DATABASE_URL) {
  const defaultDbPath = path.resolve(__dirname, "../../prisma/dev.db").replace(/\\/g, "/");
  process.env.DATABASE_URL = `file:${defaultDbPath}`;
}

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  CLIENT: z.string().default("gayatree-stay"),
  WEB_URL: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  RAZORPAY_KEY_ID: z.string().default("rzp_test_sample"),
  RAZORPAY_KEY_SECRET: z.string().default("secret_sample"),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  OWNER_PIN: z.string().default("1234"),
  JWT_SECRET: z.string().default("super-secret-owner-jwt-key"),
  HOLD_EXPIRY_MINUTES: z.coerce.number().default(15)
});

export const env = EnvSchema.parse(process.env);
