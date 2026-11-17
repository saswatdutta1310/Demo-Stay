import { prisma } from "../utils/db";
import { calculateNights } from "@hotel-demo/shared";

export interface DatePriceDetail {
  date: string;
  basePrice: number;
  isRuleApplied: boolean;
  ruleNote?: string;
}

export interface CalculatedStayPricing {
  nights: number;
  subtotal: number;
  tax: number;
  total: number;
  dailyRates: DatePriceDetail[];
}

export class PricingService {
  /**
   * Calculates the stay pricing for a specific room type across check-in and check-out dates.
   * Checks PriceRule table for date-specific overrides; falls back to roomType.basePrice.
   * Calculates tax using roomType.taxPerNight.
   */
  static async calculateStayPrice(
    roomTypeId: string,
    checkIn: Date | string,
    checkOut: Date | string
  ): Promise<CalculatedStayPricing> {
    const dIn = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
    const dOut = typeof checkOut === "string" ? new Date(checkOut) : checkOut;

    const nights = calculateNights(dIn, dOut);
    if (nights <= 0) {
      throw new Error("Invalid date range: check-out must be after check-in");
    }

    const roomType = await prisma.roomType.findUnique({
      where: { id: roomTypeId }
    });
    if (!roomType) {
      throw new Error(`Room type with id '${roomTypeId}' not found`);
    }

    // Fetch applicable price rules overlapping the date range
    const rules = await prisma.priceRule.findMany({
      where: {
        roomTypeId,
        startDate: { lt: dOut },
        endDate: { gt: dIn }
      }
    });

    const dailyRates: DatePriceDetail[] = [];
    let subtotal = 0;

    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(dIn);
      currentDate.setDate(dIn.getDate() + i);
      const dateIso = currentDate.toISOString().split("T")[0];

      // Check if any rule covers this particular day
      const matchingRule = rules.find((r) => {
        const rStart = r.startDate.toISOString().split("T")[0];
        const rEnd = r.endDate.toISOString().split("T")[0];
        return dateIso >= rStart && dateIso < rEnd;
      });

      const dayPrice = matchingRule ? matchingRule.price : roomType.basePrice;
      subtotal += dayPrice;

      dailyRates.push({
        date: dateIso,
        basePrice: dayPrice,
        isRuleApplied: !!matchingRule,
        ruleNote: matchingRule?.note || undefined
      });
    }

    const tax = Math.round(roomType.taxPerNight * nights);
    const total = subtotal + tax;

    return {
      nights,
      subtotal,
      tax,
      total,
      dailyRates
    };
  }

  /**
   * Synchronous calculation helper without db query
   */
  static calculatePrice(basePrice: number, checkIn: Date, checkOut: Date, taxPerNight = 0) {
    const nights = Math.max(1, calculateNights(checkIn, checkOut));
    const baseAmount = nights * basePrice;
    const taxAmount = taxPerNight > 0 ? taxPerNight * nights : Math.round(baseAmount * 0.12);
    const totalAmount = baseAmount + taxAmount;

    return { nights, baseAmount, taxAmount, totalAmount };
  }
}
