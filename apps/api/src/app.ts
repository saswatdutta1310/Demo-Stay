import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import roomsRoutes from "./routes/rooms.routes";
import availabilityRoutes from "./routes/availability.routes";
import bookingsRoutes from "./routes/bookings.routes";
import paymentsRoutes from "./routes/payments.routes";
import ownerRoutes from "./routes/owner.routes";
import feedbackRoutes from "./routes/feedback.routes";
import demoRoutes from "./routes/demo.routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: [env.WEB_URL, "http://localhost:3000"], credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "healthy", client: env.CLIENT, time: new Date().toISOString() });
});

app.use("/api/v1/rooms", roomsRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/bookings", bookingsRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/owner", ownerRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/demo", demoRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});
