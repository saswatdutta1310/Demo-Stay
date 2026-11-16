import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const clientSlug = process.env.CLIENT || "gayatree-stay";
  const roomsFilePath = path.resolve(__dirname, `../../../clients/${clientSlug}/rooms.json`);

  console.log(`🌱 Seeding rooms for client [${clientSlug}] from ${roomsFilePath}...`);

  if (!fs.existsSync(roomsFilePath)) {
    console.error(`Rooms configuration file not found at ${roomsFilePath}`);
    process.exit(1);
  }

  const roomsData = JSON.parse(fs.readFileSync(roomsFilePath, "utf-8"));

  for (const room of roomsData) {
    await prisma.room.upsert({
      where: { id: room.id },
      update: {
        name: room.name,
        slug: room.slug,
        price: room.price,
        capacity: room.capacity,
        unitsAvailable: room.unitsAvailable,
        description: room.description,
        amenities: room.amenities,
        images: room.images,
        bedType: room.bedType || "Double Bed"
      },
      create: {
        id: room.id,
        name: room.name,
        slug: room.slug,
        price: room.price,
        capacity: room.capacity,
        unitsAvailable: room.unitsAvailable,
        description: room.description,
        amenities: room.amenities,
        images: room.images,
        bedType: room.bedType || "Double Bed"
      }
    });
    console.log(`  ✓ Seeded room: ${room.name} (₹${room.price})`);
  }

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
