import { Router } from "express";
import { prisma } from "../utils/db";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const roomTypes = await prisma.roomType.findMany();
    res.json({ success: true, data: roomTypes });
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const roomType = await prisma.roomType.findUnique({ where: { slug: req.params.slug } });
    if (!roomType) return res.status(404).json({ success: false, message: "Room not found" });
    res.json({ success: true, data: roomType });
  } catch (err) {
    next(err);
  }
});

export default router;
