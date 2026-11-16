import { Router } from "express";
import { PaymentService } from "../services/payment.service";

const router = Router();

router.post("/order", async (req, res, next) => {
  try {
    const order = await PaymentService.createOrder(req.body.bookingId);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});

router.post("/verify", async (req, res, next) => {
  try {
    const booking = await PaymentService.verifySignature(req.body);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

router.post("/webhook", (req, res) => {
  console.log("🔔 Razorpay Webhook Event Received:", req.body?.event);
  res.json({ status: "ok" });
});

export default router;
