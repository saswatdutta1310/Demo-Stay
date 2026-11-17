import { app } from "./app";
import { env } from "./config/env";
import cron from "node-cron";
import { prisma } from "./utils/db";

// Periodic cleanup of expired holds every minute
cron.schedule("* * * * *", async () => {
  try {
    const expired = await prisma.booking.updateMany({
      where: {
        status: { in: ["PENDING", "HOLD"] },
        expiresAt: { lte: new Date() }
      },
      data: { status: "EXPIRED" }
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
