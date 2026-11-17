import fs from "fs";
import path from "path";

const clientSlug = process.argv[2];

if (!clientSlug) {
  console.error("❌ Please provide a client slug. Example: npm run client:new royal-palace");
  process.exit(1);
}

// Ensure slug format is lowercase hyphenated
const sanitizedSlug = clientSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");

const templateDir = path.resolve(__dirname, "../clients/_template");
const targetDir = path.resolve(__dirname, `../clients/${sanitizedSlug}`);

if (fs.existsSync(targetDir)) {
  console.error(`❌ Client directory "${sanitizedSlug}" already exists!`);
  process.exit(1);
}

// 1. Copy _template recursively
fs.cpSync(templateDir, targetDir, { recursive: true });

// 2. Replace the slug in config.json
const configPath = path.join(targetDir, "config.json");
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  config.slug = sanitizedSlug;
  config.name = sanitizedSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
}

console.log(`✅ Successfully scaffolded new client demo in clients/${sanitizedSlug}`);
console.log(`👉 Edit clients/${sanitizedSlug}/config.json and set CLIENT=${sanitizedSlug} in your .env file.`);
