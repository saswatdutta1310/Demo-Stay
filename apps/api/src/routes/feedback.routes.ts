import { Router } from "express";
import { prisma } from "../utils/db";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const feedback = await prisma.feedback.create({
      data: req.body
    });
    res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    next(err);
  }
});

export default router;
