import fs from "fs";
import path from "path";
import { ZodError } from "zod";
import {
  ClientConfigSchema,
  RoomsConfigSchema,
  PoliciesConfigSchema,
  ContentConfigSchema
} from "../packages/shared/src/schemas/client.schema";

function formatZodError(file: string, error: ZodError): string {
  const issues = error.issues
    .map((issue) => `field '${issue.path.join(".") || "root"}': ${issue.message}`)
    .join(", ");
  return `Invalid configuration in ${file} - ${issues}`;
}

const clientsDir = path.resolve(__dirname, "../clients");
const clients = fs.readdirSync(clientsDir).filter((f) => {
  return fs.statSync(path.join(clientsDir, f)).isDirectory();
});

console.log(`🔍 Validating ${clients.length} client folders in ${clientsDir}...`);

let hasErrors = false;

for (const client of clients) {
  const dir = path.join(clientsDir, client);
  console.log(`➡️  Checking client: [${client}]`);

  try {
    const configPath = path.join(dir, "config.json");
    const roomsPath = path.join(dir, "rooms.json");
    const policiesPath = path.join(dir, "policies.json");
    const contentPath = path.join(dir, "content.json");

    if (!fs.existsSync(configPath)) throw new Error(`Missing config.json in clients/${client}`);
    if (!fs.existsSync(roomsPath)) throw new Error(`Missing rooms.json in clients/${client}`);
    if (!fs.existsSync(policiesPath)) throw new Error(`Missing policies.json in clients/${client}`);
    if (!fs.existsSync(contentPath)) throw new Error(`Missing content.json in clients/${client}`);

    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const configResult = ClientConfigSchema.safeParse(config);
    if (!configResult.success) {
      throw new Error(formatZodError("config.json", configResult.error));
    }

    const rooms = JSON.parse(fs.readFileSync(roomsPath, "utf-8"));
    const roomsResult = RoomsConfigSchema.safeParse(rooms);
    if (!roomsResult.success) {
      throw new Error(formatZodError("rooms.json", roomsResult.error));
    }

    const policies = JSON.parse(fs.readFileSync(policiesPath, "utf-8"));
    const policiesResult = PoliciesConfigSchema.safeParse(policies);
    if (!policiesResult.success) {
      throw new Error(formatZodError("policies.json", policiesResult.error));
    }

    const content = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
    const contentResult = ContentConfigSchema.safeParse(content);
    if (!contentResult.success) {
      throw new Error(formatZodError("content.json", contentResult.error));
    }

    // Check required assets directories exist
    const requiredAssets = [
      "logo",
      "hero",
      "gallery/rooms",
      "gallery/property",
      "gallery/nearby"
    ];
    for (const assetSubdir of requiredAssets) {
      const assetPath = path.join(dir, "assets", assetSubdir);
      if (!fs.existsSync(assetPath)) {
        throw new Error(`Missing assets directory clients/${client}/assets/${assetSubdir}`);
      }
    }

    console.log(`   ✅ Valid schema & assets`);
  } catch (err: unknown) {
    const errorDetails = err instanceof Error ? err.message : String(err);
    console.error(`   ❌ Validation failed for [${client}]:`, errorDetails);
    hasErrors = true;
  }
}

if (hasErrors) {
  process.exit(1);
} else {
  console.log("✨ All client configurations are valid!");
}
