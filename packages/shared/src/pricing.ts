export function calculateNights(
  checkIn: string | Date,
  checkOut: string | Date
): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  // Normalize to UTC midnight to avoid DST or timezone boundary issues
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  const diffTime = utcEnd - utcStart;
  const nights = Math.round(diffTime / (1000 * 60 * 60 * 24));

  return nights > 0 ? nights : 0;
}

export function calculateSubtotal(basePricePerNight: number, nights: number): number {
  if (basePricePerNight < 0 || nights <= 0) return 0;
  return Math.round(basePricePerNight * nights);
}

export function calculateTax(taxPerNight: number, nights: number): number {
  if (taxPerNight < 0 || nights <= 0) return 0;
  return Math.round(taxPerNight * nights);
}

export function calculateTotal(
  basePricePerNight: number,
  taxPerNight: number,
  nights: number
): {
  nights: number;
  subtotal: number;
  tax: number;
  total: number;
} {
  const safeNights = nights > 0 ? nights : 0;
  const subtotal = calculateSubtotal(basePricePerNight, safeNights);
  const tax = calculateTax(taxPerNight, safeNights);
  const total = subtotal + tax;

  return {
    nights: safeNights,
    subtotal,
    tax,
    total
  };
}

/**
 * Formats a monetary number in Indian Rupee format (e.g. ₹2,614)
 */
export function formatCurrencyINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
