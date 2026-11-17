import fs from "fs";
import path from "path";
import {
  ClientConfigSchema,
  RoomsConfigSchema,
  PoliciesConfigSchema,
  ContentConfigSchema
} from "../packages/shared/src/schemas/client.schema";

const clientsDir = path.resolve(__dirname, "../clients");
const clients = fs.readdirSync(clientsDir).filter((f) => {
  return fs.statSync(path.join(clientsDir, f)).isDirectory();
});

console.log(`🔍 Validating ${clients.length} client folders...`);

let hasErrors = false;

for (const client of clients) {
  const dir = path.join(clientsDir, client);
  console.log(`➡️  Checking client: [${client}]`);

  try {
    const config = JSON.parse(fs.readFileSync(path.join(dir, "config.json"), "utf-8"));
    ClientConfigSchema.parse(config);

    const rooms = JSON.parse(fs.readFileSync(path.join(dir, "rooms.json"), "utf-8"));
    RoomsConfigSchema.parse(rooms);

    const policies = JSON.parse(fs.readFileSync(path.join(dir, "policies.json"), "utf-8"));
    PoliciesConfigSchema.parse(policies);

    const content = JSON.parse(fs.readFileSync(path.join(dir, "content.json"), "utf-8"));
    ContentConfigSchema.parse(content);

    console.log(`   ✅ Valid schema`);
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
