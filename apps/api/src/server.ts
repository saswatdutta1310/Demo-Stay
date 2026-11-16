import { app } from "./app";
import { env } from "./config/env";
import cron from "node-cron";
import { prisma } from "./utils/db";
import { BookingStatus } from "@hotel-demo/shared";

// Periodic cleanup of expired holds
cron.schedule("*/2 * * * *", async () => {
  try {
    const expired = await prisma.booking.updateMany({
      where: {
        status: BookingStatus.HOLD,
        holdExpiresAt: { lte: new Date() }
      },
      data: { status: BookingStatus.EXPIRED }
    });
    if (expired.count > 0) {
      console.log(`⏰ Released ${expired.count} expired booking hold(s).`);
    }
  } catch (err) {
    console.error("Error in hold-release cron:", err);
  }
});

app.listen(env.PORT, () => {
  console.log(`🏨 Hotel Demo API running on http://localhost:${env.PORT} [Client: ${env.CLIENT}]`);
});
