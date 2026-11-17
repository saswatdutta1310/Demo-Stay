import { prisma } from "../src/utils/db";
import { BookingService } from "../src/services/booking.service";

describe("Booking Service & Transactional Hold Concurrency", () => {
  let roomTypeId: string;

  beforeAll(async () => {
    // Clean test data
    await prisma.blockedDate.deleteMany();
    await prisma.priceRule.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.roomType.deleteMany();

    // Create a room type with exactly 1 unit
    const room = await prisma.roomType.create({
      data: {
        id: "single-unit-room",
        slug: "single-unit-room",
        name: "Single Unit Penthouse",
        basePrice: 5000,
        taxPerNight: 500,
        units: 1,
        maxGuests: 2,
        amenities: JSON.stringify(["Wi-Fi"]),
        images: JSON.stringify(["/placeholder.jpg"])
      }
    });

    roomTypeId = room.id;
  });

  afterAll(async () => {
    await prisma.blockedDate.deleteMany();
    await prisma.priceRule.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.roomType.deleteMany();
    await prisma.$disconnect();
  });

  it("successfully creates a pending booking with transactional 10-minute hold", async () => {
    const result = await BookingService.createBooking({
      roomTypeId,
      checkIn: "2026-12-01",
      checkOut: "2026-12-03",
      adults: 2,
      guest: {
        name: "Alice Smith",
        phone: "+919876543210",
        email: "alice@example.com",
        idType: "Aadhaar",
        isPrimaryGuestAdult: true,
        isMaleOnlyGroup: false
      }
    });

    expect(result.booking).toBeDefined();
    expect(result.booking.code).toMatch(/^GS-[A-F0-9]{6}$/);
    expect(result.booking.status).toBe("PENDING");
    expect(result.booking.expiresAt).toBeDefined();
    expect(result.booking.total).toBe(11000); // 2 nights * (5000 + 500)
  });

  it("concurrent requests for the last remaining room cannot both succeed", async () => {
    // Clear bookings to leave exactly 1 unit available
    await prisma.booking.deleteMany();

    const requestA = BookingService.createBooking({
      roomTypeId,
      checkIn: "2026-12-10",
      checkOut: "2026-12-12",
      adults: 1,
      guest: {
        name: "User A",
        phone: "+919876543211",
        email: "userA@example.com",
        idType: "Passport",
        isPrimaryGuestAdult: true
      }
    });

    const requestB = BookingService.createBooking({
      roomTypeId,
      checkIn: "2026-12-10",
      checkOut: "2026-12-12",
      adults: 1,
      guest: {
        name: "User B",
        phone: "+919876543212",
        email: "userB@example.com",
        idType: "Passport",
        isPrimaryGuestAdult: true
      }
    });

    const results = await Promise.allSettled([requestA, requestB]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    // Exactly one must succeed, and one must be rejected because inventory is 1 unit
    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);

    const activeBookings = await prisma.booking.findMany({
      where: { roomTypeId, status: "PENDING" }
    });
    expect(activeBookings.length).toBe(1);
  });

  it("enforces 24-hour cancellation rule", async () => {
    // 1. Booking far in advance can be cancelled
    const farBooking = await BookingService.createBooking({
      roomTypeId,
      checkIn: "2027-01-01",
      checkOut: "2027-01-03",
      adults: 1,
      guest: {
        name: "John Doe",
        phone: "+919876543220",
        email: "john@example.com",
        idType: "Aadhaar",
        isPrimaryGuestAdult: true
      }
    });

    const cancelled = await BookingService.cancelBooking(farBooking.booking.code);
    expect(cancelled.status).toBe("CANCELLED");

    // 2. Booking checking in within 24 hours cannot be cancelled
    const tomorrow = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now
    const dayAfter = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);

    const nearBooking = await prisma.booking.create({
      data: {
        code: "GS-IMMNT1",
        roomTypeId,
        guestId: farBooking.booking.guestId,
        checkIn: tomorrow,
        checkOut: dayAfter,
        adults: 1,
        subtotal: 5000,
        tax: 500,
        total: 5500,
        status: "CONFIRMED"
      }
    });

    await expect(BookingService.cancelBooking(nearBooking.code)).rejects.toThrow(
      "Cancellation must be made at least 24 hours prior to check-in"
    );
  });

  it("rejects booking if policy constraints are violated", async () => {
    // 1. Underage primary guest
    await expect(
      BookingService.createBooking({
        roomTypeId,
        checkIn: "2026-12-20",
        checkOut: "2026-12-22",
        adults: 1,
        guest: {
          name: "Young Guest",
          phone: "+919876543230",
          email: "young@example.com",
          idType: "Aadhaar",
          isPrimaryGuestAdult: false
        }
      })
    ).rejects.toThrow("Primary guest must be at least 18 years old");

    // 2. Male-only group restriction
    await expect(
      BookingService.createBooking({
        roomTypeId,
        checkIn: "2026-12-20",
        checkOut: "2026-12-22",
        adults: 2,
        guest: {
          name: "Boy Squad",
          phone: "+919876543231",
          email: "boys@example.com",
          idType: "Aadhaar",
          isMaleOnlyGroup: true
        }
      })
    ).rejects.toThrow("Male-only groups are not permitted as per property policy");

    // 3. Unaccepted ID Type
    await expect(
      BookingService.createBooking({
        roomTypeId,
        checkIn: "2026-12-20",
        checkOut: "2026-12-22",
        adults: 1,
        guest: {
          name: "Guest",
          phone: "+919876543232",
          email: "guest@example.com",
          idType: "College ID Card"
        }
      })
    ).rejects.toThrow(/Invalid ID type/);
  });
});
