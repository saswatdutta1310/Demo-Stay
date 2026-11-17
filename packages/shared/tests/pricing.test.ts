import {
  calculateNights,
  calculateSubtotal,
  calculateTax,
  calculateTotal
} from "../src/pricing";

describe("Pricing Helpers", () => {
  describe("calculateNights", () => {
    it("calculates exact nights between two dates correctly", () => {
      expect(calculateNights("2026-12-01", "2026-12-05")).toBe(4);
      expect(calculateNights("2026-05-10", "2026-05-11")).toBe(1);
    });

    it("returns 0 if checkOut is equal or before checkIn", () => {
      expect(calculateNights("2026-12-05", "2026-12-05")).toBe(0);
      expect(calculateNights("2026-12-05", "2026-12-01")).toBe(0);
    });

    it("supports Date objects", () => {
      const d1 = new Date(2026, 6, 1);
      const d2 = new Date(2026, 6, 4);
      expect(calculateNights(d1, d2)).toBe(3);
    });
  });

  describe("calculateSubtotal", () => {
    it("calculates subtotal as basePrice * nights", () => {
      expect(calculateSubtotal(1500, 3)).toBe(4500);
      expect(calculateSubtotal(2200, 1)).toBe(2200);
    });

    it("returns 0 when nights is 0 or negative", () => {
      expect(calculateSubtotal(1500, 0)).toBe(0);
      expect(calculateSubtotal(1500, -1)).toBe(0);
    });
  });

  describe("calculateTax", () => {
    it("calculates tax as taxPerNight * nights", () => {
      expect(calculateTax(180, 3)).toBe(540);
      expect(calculateTax(250, 2)).toBe(500);
    });

    it("returns 0 when nights is 0 or negative", () => {
      expect(calculateTax(180, 0)).toBe(0);
      expect(calculateTax(180, -2)).toBe(0);
    });
  });

  describe("calculateTotal", () => {
    it("aggregates nights, subtotal, tax and total correctly", () => {
      const summary = calculateTotal(2000, 240, 3);
      expect(summary).toEqual({
        nights: 3,
        subtotal: 6000,
        tax: 720,
        total: 6720
      });
    });

    it("handles 0 nights gracefully", () => {
      const summary = calculateTotal(2000, 240, 0);
      expect(summary).toEqual({
        nights: 0,
        subtotal: 0,
        tax: 0,
        total: 0
      });
    });
  });
});
