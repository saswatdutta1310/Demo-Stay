import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../utils/db";

const router = Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const roomTypes = await prisma.roomType.findMany({
      orderBy: { basePrice: "asc" }
    });

    const parsedRoomTypes = roomTypes.map((rt) => ({
      ...rt,
      amenities: JSON.parse(rt.amenities || "[]"),
      images: JSON.parse(rt.images || "[]")
    }));

    res.json({ success: true, data: parsedRoomTypes });
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomType = await prisma.roomType.findUnique({
      where: { slug: req.params.slug }
    });
    if (!roomType) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const parsed = {
      ...roomType,
      amenities: JSON.parse(roomType.amenities || "[]"),
      images: JSON.parse(roomType.images || "[]")
    };

    res.json({ success: true, data: parsed });
  } catch (err) {
    next(err);
  }
});

export default router;
