import { prisma } from "../src/utils/db";
import { AvailabilityService } from "../src/services/availability.service";
import { PricingService } from "../src/services/pricing.service";
import { BookingStatus } from "@hotel-demo/shared";

describe("Pricing & Availability Services", () => {
  const testRoomId = "test-king-room";

  beforeAll(async () => {
    // Clean up test data
    await prisma.blockedDate.deleteMany();
    await prisma.priceRule.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.guest.deleteMany();
    await prisma.roomType.deleteMany();

    // Create a base room type with 2 units, base price 2000, tax 240
    await prisma.roomType.create({
      data: {
        id: testRoomId,
        slug: "test-king-room",
        name: "Test King Room",
        sizeSqFt: 150,
        bed: "1 King Bed",
        maxGuests: 2,
        amenities: JSON.stringify(["WiFi", "AC"]),
        basePrice: 2000,
        taxPerNight: 240,
        units: 2,
        images: JSON.stringify([])
      }
    });
  });

  afterAll(async () => {
    await prisma.blockedDate.deleteMany();
    await prisma.priceRule.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.guest.deleteMany();
    await prisma.roomType.deleteMany();
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.blockedDate.deleteMany();
    await prisma.priceRule.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
  });

  describe("PricingService", () => {
    it("calculates standard multi-night stay without price rules", async () => {
      const pricing = await PricingService.calculateStayPrice(
        testRoomId,
        "2026-12-01",
        "2026-12-04"
      );

      expect(pricing.nights).toBe(3);
      expect(pricing.subtotal).toBe(6000); // 3 * 2000
      expect(pricing.tax).toBe(720); // 3 * 240
      expect(pricing.total).toBe(6720);
      expect(pricing.dailyRates.length).toBe(3);
      expect(pricing.dailyRates[0].isRuleApplied).toBe(false);
    });

    it("applies date-specific PriceRule overrides", async () => {
      // Add a peak price rule of 3500 for 2026-12-02
      await prisma.priceRule.create({
        data: {
          roomTypeId: testRoomId,
          startDate: new Date("2026-12-02"),
          endDate: new Date("2026-12-03"),
          price: 3500,
          note: "Temple festival surcharge"
        }
      });

      const pricing = await PricingService.calculateStayPrice(
        testRoomId,
        "2026-12-01",
        "2026-12-04"
      );

      expect(pricing.nights).toBe(3);
      // Dec 01: 2000, Dec 02: 3500, Dec 03: 2000 => subtotal 7500
      expect(pricing.subtotal).toBe(7500);
      expect(pricing.tax).toBe(720);
      expect(pricing.total).toBe(8220);
      expect(pricing.dailyRates[1].isRuleApplied).toBe(true);
      expect(pricing.dailyRates[1].ruleNote).toBe("Temple festival surcharge");
    });
  });

  describe("AvailabilityService Edge Cases", () => {
    it("case 1: fully available when no bookings exist", async () => {
      const results = await AvailabilityService.checkAvailability(
        "2026-12-01",
        "2026-12-03"
      );
      const room = results.find((r) => r.roomType.id === testRoomId);
      expect(room).toBeDefined();
      expect(room?.availableUnits).toBe(2);
      expect(room?.isAvailable).toBe(true);
    });

    it("case 2: same-day check-out and check-in does not count as overlap", async () => {
      // Guest A checks in Dec 01 and checks out Dec 03
      const guest = await prisma.guest.create({
        data: { name: "Guest A", phone: "+919999999991", email: "a@example.com" }
      });
      await prisma.booking.create({
        data: {
          code: "GS-000001",
          roomTypeId: testRoomId,
          guestId: guest.id,
          checkIn: new Date("2026-12-01"),
          checkOut: new Date("2026-12-03"),
          status: BookingStatus.CONFIRMED,
          subtotal: 4000,
          tax: 480,
          total: 4480
        }
      });

      // Guest B searches starting Dec 03 (the same day Guest A leaves)
      const results = await AvailabilityService.checkAvailability(
        "2026-12-03",
        "2026-12-05"
      );
      const room = results.find((r) => r.roomType.id === testRoomId);
      // Because checkOut of A == checkIn of B, no overlap! Full 2 units remain available.
      expect(room?.availableUnits).toBe(2);
    });

    it("case 3: unexpired PENDING holds block units", async () => {
      const guest = await prisma.guest.create({
        data: { name: "Guest B", phone: "+919999999992", email: "b@example.com" }
      });
      // 1 unit held for 15 minutes
      await prisma.booking.create({
        data: {
          code: "GS-000002",
          roomTypeId: testRoomId,
          guestId: guest.id,
          checkIn: new Date("2026-12-05"),
          checkOut: new Date("2026-12-07"),
          status: BookingStatus.PENDING,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // active hold
          subtotal: 4000,
          tax: 480,
          total: 4480
        }
      });

      const results = await AvailabilityService.checkAvailability(
        "2026-12-05",
        "2026-12-07"
      );
      const room = results.find((r) => r.roomType.id === testRoomId);
      expect(room?.availableUnits).toBe(1); // 2 - 1 = 1
    });

    it("case 4: expired PENDING holds do NOT block units", async () => {
      const guest = await prisma.guest.create({
        data: { name: "Guest C", phone: "+919999999993", email: "c@example.com" }
      });
      // Hold expired 5 minutes ago
      await prisma.booking.create({
        data: {
          code: "GS-000003",
          roomTypeId: testRoomId,
          guestId: guest.id,
          checkIn: new Date("2026-12-08"),
          checkOut: new Date("2026-12-10"),
          status: BookingStatus.PENDING,
          expiresAt: new Date(Date.now() - 5 * 60 * 1000), // expired hold
          subtotal: 4000,
          tax: 480,
          total: 4480
        }
      });

      const results = await AvailabilityService.checkAvailability(
        "2026-12-08",
        "2026-12-10"
      );
      const room = results.find((r) => r.roomType.id === testRoomId);
      expect(room?.availableUnits).toBe(2);
    });

    it("case 5: blocked dates reduce available units to 0", async () => {
      await prisma.blockedDate.create({
        data: {
          roomTypeId: testRoomId,
          startDate: new Date("2026-12-15"),
          endDate: new Date("2026-12-18"),
          reason: "Renovation and deep cleaning"
        }
      });

      const results = await AvailabilityService.checkAvailability(
        "2026-12-16",
        "2026-12-17"
      );
      const room = results.find((r) => r.roomType.id === testRoomId);
      expect(room?.availableUnits).toBe(0);
      expect(room?.isAvailable).toBe(false);
    });

    it("case 6: fully booked inventory correctly marks room as unavailable", async () => {
      const guest = await prisma.guest.create({
        data: { name: "Guest D", phone: "+919999999994", email: "d@example.com" }
      });

      // Book all 2 units
      await prisma.booking.create({
        data: {
          code: "GS-000004",
          roomTypeId: testRoomId,
          guestId: guest.id,
          checkIn: new Date("2026-12-20"),
          checkOut: new Date("2026-12-22"),
          status: BookingStatus.CONFIRMED,
          subtotal: 4000,
          tax: 480,
          total: 4480
        }
      });
      await prisma.booking.create({
        data: {
          code: "GS-000005",
          roomTypeId: testRoomId,
          guestId: guest.id,
          checkIn: new Date("2026-12-20"),
          checkOut: new Date("2026-12-22"),
          status: BookingStatus.CONFIRMED,
          subtotal: 4000,
          tax: 480,
          total: 4480
        }
      });

      const results = await AvailabilityService.checkAvailability(
        "2026-12-20",
        "2026-12-22"
      );
      const room = results.find((r) => r.roomType.id === testRoomId);
      expect(room?.availableUnits).toBe(0);
      expect(room?.isAvailable).toBe(false);
    });
  });
});
