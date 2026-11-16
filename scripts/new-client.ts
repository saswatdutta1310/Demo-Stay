import fs from "fs";
import path from "path";

const clientName = process.argv[2];

if (!clientName) {
  console.error("❌ Please provide a client slug. Example: npm run client:new royal-palace");
  process.exit(1);
}

const templateDir = path.resolve(__dirname, "../clients/_template");
const targetDir = path.resolve(__dirname, `../clients/${clientName}`);

if (fs.existsSync(targetDir)) {
  console.error(`❌ Client directory "${clientName}" already exists!`);
  process.exit(1);
}

fs.cpSync(templateDir, targetDir, { recursive: true });

console.log(`✅ Successfully scaffolded new client demo in clients/${clientName}`);
console.log(`👉 Edit clients/${clientName}/config.json and set CLIENT=${clientName} in your .env file.`);
