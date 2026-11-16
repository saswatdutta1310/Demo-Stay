import fs from "fs";
import path from "path";
import { env } from "./env";
import {
  ClientConfigSchema,
  RoomsConfigSchema,
  PoliciesConfigSchema,
  ContentConfigSchema,
  ClientConfig,
  Room,
  PoliciesConfig,
  ContentConfig
} from "@hotel-demo/shared";

const clientDir = path.resolve(__dirname, `../../../../clients/${env.CLIENT}`);

export function loadClientData(): {
  config: ClientConfig;
  rooms: Room[];
  policies: PoliciesConfig;
  content: ContentConfig;
} {
  const config = ClientConfigSchema.parse(
    JSON.parse(fs.readFileSync(path.join(clientDir, "config.json"), "utf-8"))
  );
  const rooms = RoomsConfigSchema.parse(
    JSON.parse(fs.readFileSync(path.join(clientDir, "rooms.json"), "utf-8"))
  );
  const policies = PoliciesConfigSchema.parse(
    JSON.parse(fs.readFileSync(path.join(clientDir, "policies.json"), "utf-8"))
  );
  const content = ContentConfigSchema.parse(
    JSON.parse(fs.readFileSync(path.join(clientDir, "content.json"), "utf-8"))
  );

  return { config, rooms, policies, content };
}
