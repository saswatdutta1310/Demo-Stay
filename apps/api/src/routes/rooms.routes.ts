import { Router } from "express";
import { prisma } from "../utils/db";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const rooms = await prisma.room.findMany();
    res.json({ success: true, data: rooms });
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const room = await prisma.room.findUnique({ where: { slug: req.params.slug } });
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });
    res.json({ success: true, data: room });
  } catch (err) {
    next(err);
  }
});

export default router;
