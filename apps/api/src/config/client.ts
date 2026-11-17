import fs from "fs";
import path from "path";
import { ZodError } from "zod";
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

function formatZodError(file: string, error: ZodError): string {
  const issues = error.issues
    .map((issue) => `field '${issue.path.join(".") || "root"}': ${issue.message}`)
    .join(", ");
  return `Invalid client configuration in ${file} - ${issues}`;
}

function loadJsonFile(filePath: string, fileName: string): unknown {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required client file: ${fileName} at ${filePath}`);
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(`Invalid JSON syntax in ${fileName}: ${err.message}`);
    }
    throw err;
  }
}

export function loadClientData(explicitSlug?: string): {
  config: ClientConfig;
  rooms: Room[];
  policies: PoliciesConfig;
  content: ContentConfig;
} {
  const clientSlug = explicitSlug || env.CLIENT || "gayatree-stay";

  const candidateDirs = [
    path.resolve(process.cwd(), "clients", clientSlug),
    path.resolve(process.cwd(), "../../clients", clientSlug),
    path.resolve(__dirname, "../../../../clients", clientSlug),
    path.resolve(__dirname, "../../../clients", clientSlug)
  ];

  let clientDir = candidateDirs.find((dir) => fs.existsSync(dir));
  if (!clientDir) {
    clientDir = candidateDirs[0];
  }

  const configFile = path.join(clientDir, "config.json");
  const roomsFile = path.join(clientDir, "rooms.json");
  const policiesFile = path.join(clientDir, "policies.json");
  const contentFile = path.join(clientDir, "content.json");

  // 1. Config
  const rawConfig = loadJsonFile(configFile, "config.json");
  const parsedConfig = ClientConfigSchema.safeParse(rawConfig);
  if (!parsedConfig.success) {
    throw new Error(formatZodError("config.json", parsedConfig.error));
  }

  // 2. Rooms
  const rawRooms = loadJsonFile(roomsFile, "rooms.json");
  const parsedRooms = RoomsConfigSchema.safeParse(rawRooms);
  if (!parsedRooms.success) {
    throw new Error(formatZodError("rooms.json", parsedRooms.error));
  }

  // 3. Policies
  const rawPolicies = loadJsonFile(policiesFile, "policies.json");
  const parsedPolicies = PoliciesConfigSchema.safeParse(rawPolicies);
  if (!parsedPolicies.success) {
    throw new Error(formatZodError("policies.json", parsedPolicies.error));
  }

  // 4. Content
  const rawContent = loadJsonFile(contentFile, "content.json");
  const parsedContent = ContentConfigSchema.safeParse(rawContent);
  if (!parsedContent.success) {
    throw new Error(formatZodError("content.json", parsedContent.error));
  }

  return {
    config: parsedConfig.data,
    rooms: parsedRooms.data,
    policies: parsedPolicies.data,
    content: parsedContent.data
  };
}
