import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

const prisma = new PrismaClient();

async function main() {
  const clientSlug = process.env.CLIENT || "gayatree-stay";

  const candidateDirs = [
    path.resolve(process.cwd(), `clients/${clientSlug}`),
    path.resolve(process.cwd(), `../../clients/${clientSlug}`),
    path.resolve(__dirname, `../../../clients/${clientSlug}`)
  ];

  const clientDir = candidateDirs.find((dir) => fs.existsSync(dir));
  if (!clientDir) {
    throw new Error(
      `Could not locate client folder for '${clientSlug}'. Checked: ${candidateDirs.join(", ")}`
    );
  }

  const roomsFilePath = path.join(clientDir, "rooms.json");
  if (!fs.existsSync(roomsFilePath)) {
    throw new Error(`Rooms configuration file not found at ${roomsFilePath}`);
  }

  console.log(`🌱 Seeding RoomType records for client [${clientSlug}] from ${roomsFilePath}...`);

  const roomsData = JSON.parse(fs.readFileSync(roomsFilePath, "utf-8"));

  for (const room of roomsData) {
    const roomId = room.id || room.slug;
    const basePrice = room.basePrice ?? room.price ?? 2000;
    const taxPerNight = room.taxPerNight ?? Math.round(basePrice * 0.12);
    const units = room.units ?? room.unitsAvailable ?? 1;
    const maxGuests = room.maxGuests ?? room.capacity ?? 2;
    const bed = room.bed ?? room.bedType ?? "1 King Bed";
    const sizeSqFt = room.sizeSqFt ?? null;
    const amenities = JSON.stringify(room.amenities || []);
    const images = JSON.stringify(room.images || []);
    const description = room.description || `${room.name} with modern amenities.`;

    await prisma.roomType.upsert({
      where: { id: roomId },
      update: {
        slug: room.slug,
        name: room.name,
        sizeSqFt,
        bed,
        maxGuests,
        amenities,
        basePrice,
        taxPerNight,
        units,
        images,
        description
      },
      create: {
        id: roomId,
        slug: room.slug,
        name: room.name,
        sizeSqFt,
        bed,
        maxGuests,
        amenities,
        basePrice,
        taxPerNight,
        units,
        images,
        description
      }
    });

    console.log(`  ✓ Seeded RoomType: ${room.name} (Base ₹${basePrice}, Units: ${units})`);
  }

  console.log("✨ RoomType seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
