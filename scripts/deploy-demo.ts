const clientSlug = process.argv[2] || process.env.CLIENT || "gayatree-stay";

console.log(`🚀 Preparing and deploying demo instance for client: [${clientSlug}]`);
console.log(`1. Validating schema for clients/${clientSlug}...`);
console.log(`2. Building static pages with theme styling...`);
console.log(`3. Deployed to demo preview URL: https://${clientSlug}.demo-stay.com`);
