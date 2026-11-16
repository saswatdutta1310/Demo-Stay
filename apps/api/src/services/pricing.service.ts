import { DEFAULT_TAX_PERCENTAGE } from "@hotel-demo/shared";

export class PricingService {
  static calculatePrice(basePrice: number, checkIn: Date, checkOut: Date) {
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const baseAmount = nights * basePrice;
    const taxAmount = Math.round((baseAmount * DEFAULT_TAX_PERCENTAGE) / 100);
    const totalAmount = baseAmount + taxAmount;

    return { nights, baseAmount, taxAmount, totalAmount };
  }
}
