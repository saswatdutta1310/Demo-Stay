import {
  GuestDetailsFormSchema,
  calculateTotal,
  formatCurrencyINR,
  calculateNights,
  ACCEPTED_ID_TYPES
} from "../src/index";

describe("Booking Form Validation & Price Display Tests", () => {
  describe("GuestDetailsFormSchema Validation", () => {
    const validFormData = {
      guestName: "Saswat Dutta",
      guestPhone: "+91 9876543210",
      guestEmail: "saswat@example.com",
      idType: ACCEPTED_ID_TYPES[0], // Passport
      isAdult: true,
      acceptsPolicies: true,
      specialRequests: "Quiet corner room please"
    };

    it("accepts valid guest booking details", () => {
      const result = GuestDetailsFormSchema.safeParse(validFormData);
      expect(result.success).toBe(true);
    });

    it("rejects names shorter than 2 characters", () => {
      const result = GuestDetailsFormSchema.safeParse({
        ...validFormData,
        guestName: "A"
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/at least 2 characters/i);
      }
    });

    it("rejects invalid phone numbers or those under 10 digits", () => {
      const result1 = GuestDetailsFormSchema.safeParse({
        ...validFormData,
        guestPhone: "12345"
      });
      expect(result1.success).toBe(false);

      const result2 = GuestDetailsFormSchema.safeParse({
        ...validFormData,
        guestPhone: "abcdefghij"
      });
      expect(result2.success).toBe(false);
    });

    it("rejects invalid email formats", () => {
      const result = GuestDetailsFormSchema.safeParse({
        ...validFormData,
        guestEmail: "not-an-email"
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/valid email/i);
      }
    });

    it("requires primary guest to be 18+ (isAdult: true)", () => {
      const result = GuestDetailsFormSchema.safeParse({
        ...validFormData,
        isAdult: false
      });
      expect(result.success).toBe(false);
    });

    it("requires acceptance of house policies (no local IDs, no male-only groups)", () => {
      const result = GuestDetailsFormSchema.safeParse({
        ...validFormData,
        acceptsPolicies: false
      });
      expect(result.success).toBe(false);
    });

    it("only permits accepted government ID types", () => {
      const result = GuestDetailsFormSchema.safeParse({
        ...validFormData,
        idType: "College ID" // Not accepted
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Price Display & Calculation Integration", () => {
    it("calculates multi-night room prices and formats correctly", () => {
      // Room: Non AC Room (basePrice: 2150, tax: 350 per night, 3 nights)
      const nights = calculateNights("2026-12-01", "2026-12-04");
      expect(nights).toBe(3);

      const pricing = calculateTotal(2150, 350, nights);
      expect(pricing.subtotal).toBe(6450);
      expect(pricing.tax).toBe(1050);
      expect(pricing.total).toBe(7500);

      // Verify display strings format with ₹
      expect(formatCurrencyINR(pricing.subtotal)).toBe("₹6,450");
      expect(formatCurrencyINR(pricing.tax)).toBe("₹1,050");
      expect(formatCurrencyINR(pricing.total)).toBe("₹7,500");
    });

    it("calculates single night pricing accurately", () => {
      // Room: King Size Bed Room (basePrice: 2614, tax: 420 per night, 1 night)
      const pricing = calculateTotal(2614, 420, 1);
      expect(pricing.subtotal).toBe(2614);
      expect(pricing.tax).toBe(420);
      expect(pricing.total).toBe(3034);

      expect(formatCurrencyINR(pricing.total)).toBe("₹3,034");
    });
  });
});
