"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  calculateNights,
  calculateTotal,
  ACCEPTED_ID_TYPES,
  AcceptedIDType,
  Room
} from "@hotel-demo/shared";
import {
  getRooms,
  getAvailability,
  createBooking,
  createPaymentOrder,
  confirmPayment
} from "@/lib/api";
import {
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lock
} from "lucide-react";

// Guest form Zod schema
const GuestDetailsSchema = z.object({
  guestName: z.string().min(2, "Full name must be at least 2 characters"),
  guestPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+ -]{10,15}$/, "Please enter a valid phone number"),
  guestEmail: z.string().email("Please enter a valid email address"),
  idType: z.enum(ACCEPTED_ID_TYPES, {
    errorMap: () => ({ message: "Please select an accepted government ID type" })
  }),
  isAdult: z.literal(true, {
    errorMap: () => ({ message: "Primary guest must be 18+ years of age" })
  }),
  acceptsPolicies: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the property rules (no male-only groups, no local IDs)"
    })
  }),
  specialRequests: z.string().optional()
});

export type GuestDetailsForm = z.infer<typeof GuestDetailsSchema>;

function BookingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active step (1: Dates & Room, 2: Guest Details, 3: Review & Pay)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Available rooms list & loading state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Step 1: Selection State
  const initialRoomId = searchParams.get("room") || "";
  const initialCheckIn = searchParams.get("checkIn") || "2026-12-01";
  const initialCheckOut = searchParams.get("checkOut") || "2026-12-03";
  const initialGuests = Number(searchParams.get("guests")) || 2;

  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guestsCount, setGuestsCount] = useState(initialGuests);
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);

  // Step 2: Guest Details State
  const [guestForm, setGuestForm] = useState<{
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    idType: AcceptedIDType;
    isAdult: boolean;
    acceptsPolicies: boolean;
    specialRequests: string;
  }>({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    idType: "Aadhaar",
    isAdult: false,
    acceptsPolicies: false,
    specialRequests: ""
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 3: Payment modal state
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showMockModal, setShowMockModal] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  // Load initial rooms
  useEffect(() => {
    let mounted = true;
    getRooms()
      .then((data) => {
        if (!mounted) return;
        setRooms(data);
        if (data.length > 0 && !selectedRoomId) {
          const match = initialRoomId
            ? data.find((r) => r.id === initialRoomId || r.slug === initialRoomId)
            : data[0];
          setSelectedRoomId(match ? match.id : data[0].id);
        }
      })
      .finally(() => {
        if (mounted) setLoadingRooms(false);
      });
    return () => {
      mounted = false;
    };
  }, [initialRoomId, selectedRoomId]);

  // Check availability when dates change
  useEffect(() => {
    if (!checkIn || !checkOut) return;
    let mounted = true;
    setCheckingAvailability(true);

    getAvailability(checkIn, checkOut, guestsCount)
      .then((avail) => {
        if (!mounted) return;
        setAvailableRooms(avail);
      })
      .catch(() => {
        if (!mounted) return;
        setAvailableRooms(rooms);
      })
      .finally(() => {
        if (mounted) setCheckingAvailability(false);
      });

    return () => {
      mounted = false;
    };
  }, [checkIn, checkOut, guestsCount, rooms]);

  // Selected room details
  const selectedRoom = useMemo(() => {
    return (
      rooms.find((r) => r.id === selectedRoomId || r.slug === selectedRoomId) ||
      rooms[0] ||
      null
    );
  }, [rooms, selectedRoomId]);

  // Pricing calculations
  const nights = useMemo(() => calculateNights(checkIn, checkOut), [checkIn, checkOut]);

  const pricing = useMemo(() => {
    if (!selectedRoom || nights <= 0) {
      return { nights: 0, subtotal: 0, tax: 0, total: 0 };
    }
    return calculateTotal(selectedRoom.basePrice, selectedRoom.taxPerNight, nights);
  }, [selectedRoom, nights]);

  // Step 1 validation
  const handleProceedToStep2 = () => {
    if (nights <= 0) {
      alert("Check-out date must be after check-in date.");
      return;
    }
    if (!selectedRoom) {
      alert("Please select a room.");
      return;
    }
    setCurrentStep(2);
  };

  // Step 2 validation
  const handleProceedToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    const result = GuestDetailsSchema.safeParse(guestForm);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setFormErrors(fieldErrors);
      return;
    }

    setFormErrors({});
    setCurrentStep(3);
  };

  // Step 3: Initiate Payment
  const handleInitiatePayment = async () => {
    if (!selectedRoom) return;
    setIsPaying(true);
    setPaymentError(null);

    try {
      // 1. Create booking record
      const booking = await createBooking({
        roomId: selectedRoom.id,
        checkIn,
        checkOut,
        guestName: guestForm.guestName,
        guestEmail: guestForm.guestEmail,
        guestPhone: guestForm.guestPhone,
        guestsCount,
        specialRequests: guestForm.specialRequests
      });

      setCreatedBookingId(booking.id || null);

      // 2. Create Razorpay Payment Order
      await createPaymentOrder(booking.id || "");

      // Open mock payment dialog
      setShowMockModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to initiate booking";
      setPaymentError(msg);
    } finally {
      setIsPaying(false);
    }
  };

  // Step 3: Confirm simulated Razorpay payment
  const handleConfirmMockPayment = async () => {
    if (!createdBookingId) return;
    setIsPaying(true);

    try {
      const confirmed = await confirmPayment(createdBookingId);
      setShowMockModal(false);
      router.push(`/book/confirmation/${confirmed.code}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment confirmation failed";
      setPaymentError(msg);
      setIsPaying(false);
    }
  };

  if (loadingRooms) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-neutral-500">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-400" />
        Loading room availability...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* 3-Step Progress Indicator */}
      <div className="border-b border-neutral-200 pb-4">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div
            className={`flex items-center gap-2 ${
              currentStep === 1
                ? "text-neutral-900 font-bold"
                : currentStep > 1
                ? "text-emerald-700"
                : "text-neutral-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep > 1
                  ? "bg-emerald-100 text-emerald-800"
                  : currentStep === 1
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-200 text-neutral-600"
              }`}
            >
              1
            </span>
            <span>Dates & Room</span>
          </div>

          <div className="h-0.5 flex-1 mx-4 bg-neutral-200" />

          <div
            className={`flex items-center gap-2 ${
              currentStep === 2
                ? "text-neutral-900 font-bold"
                : currentStep > 2
                ? "text-emerald-700"
                : "text-neutral-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep > 2
                  ? "bg-emerald-100 text-emerald-800"
                  : currentStep === 2
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-200 text-neutral-600"
              }`}
            >
              2
            </span>
            <span>Guest Details</span>
          </div>

          <div className="h-0.5 flex-1 mx-4 bg-neutral-200" />

          <div
            className={`flex items-center gap-2 ${
              currentStep === 3 ? "text-neutral-900 font-bold" : "text-neutral-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep === 3 ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-600"
              }`}
            >
              3
            </span>
            <span>Review & Pay</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Main Step Body */}
        <div className="md:col-span-2 bg-white border border-neutral-200 rounded p-6 shadow-sm">
          {/* STEP 1: DATES & ROOM */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Step 1: Dates, Guests & Room</h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Choose your check-in and check-out dates to check room availability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="step1CheckIn" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Check-In Date
                  </label>
                  <input
                    id="step1CheckIn"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="step1CheckOut" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Check-Out Date
                  </label>
                  <input
                    id="step1CheckOut"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="step1Guests" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Guests
                  </label>
                  <select
                    id="step1Guests"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2 text-xs focus:outline-none bg-white"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                  </select>
                </div>
              </div>

              {nights <= 0 ? (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                  Please pick a check-out date after check-in.
                </div>
              ) : (
                <div className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                  Stay duration: <strong>{nights} night{nights > 1 ? "s" : ""}</strong>
                </div>
              )}

              {/* Room Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-900 mb-2">
                  Select Accommodation:
                </label>
                <div className="space-y-3">
                  {rooms.map((room) => {
                    const isAvail = availableRooms.some((a) => a.id === room.id);
                    const isSelected = selectedRoom?.id === room.id;

                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`p-4 rounded border text-left cursor-pointer transition ${
                          isSelected
                            ? "border-neutral-900 bg-neutral-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-neutral-900">{room.name}</span>
                              {isSelected && (
                                <span className="text-[10px] bg-neutral-900 text-white px-2 py-0.5 rounded font-medium">
                                  Selected
                                </span>
                              )}
                              {isAvail ? (
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                                  Available
                                </span>
                              ) : (
                                <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded">
                                  Limited Availability
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-500 mt-1">
                              {room.bed} • {room.sizeSqFt} sq ft • Max {room.maxGuests} guests
                            </p>
                          </div>

                          <div className="sm:text-right">
                            <span className="text-base font-bold text-neutral-900">₹{room.basePrice}</span>
                            <span className="text-[11px] text-neutral-500"> / night</span>
                            <span className="block text-[11px] text-neutral-500">+ ₹{room.taxPerNight} tax</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  disabled={nights <= 0 || checkingAvailability}
                  className="px-5 py-2.5 text-white font-medium text-xs rounded transition flex items-center gap-1.5 disabled:opacity-50"
                  style={{ backgroundColor: "var(--color-accent)" }}
                >
                  Continue to Guest Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: GUEST DETAILS */}
          {currentStep === 2 && (
            <form onSubmit={handleProceedToStep3} className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Step 2: Guest Information & Verification</h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Government regulations require primary guest verification details.
                </p>
              </div>

              {/* Property Rules Notice */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded space-y-1.5 text-xs text-neutral-800">
                <div className="font-semibold flex items-center gap-1.5 text-neutral-900">
                  <ShieldCheck className="w-4 h-4 text-neutral-700" /> Property Check-In Requirements
                </div>
                <ul className="list-disc list-inside text-neutral-600 space-y-0.5 text-[11px]">
                  <li>Primary guest must be 18+ years of age.</li>
                  <li><strong>No male-only groups allowed.</strong></li>
                  <li><strong>Local IDs not accepted</strong> for check-in.</li>
                  <li>Accepted photo ID: Passport, Aadhaar, Driving License, or Govt ID.</li>
                  <li>We do not store complete ID numbers on web booking forms.</li>
                </ul>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="guestName" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Primary Guest Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="guestName"
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={guestForm.guestName}
                    onChange={(e) => setGuestForm({ ...guestForm, guestName: e.target.value })}
                    className={`w-full border rounded p-2 text-xs focus:outline-none ${
                      formErrors.guestName ? "border-red-500" : "border-neutral-300"
                    }`}
                  />
                  {formErrors.guestName && (
                    <p className="text-red-600 text-[11px] mt-1">{formErrors.guestName}</p>
                  )}
                </div>

                {/* Contact grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="guestPhone" className="block text-xs font-semibold text-neutral-700 mb-1">
                      Phone Number (WhatsApp Voucher) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="guestPhone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={guestForm.guestPhone}
                      onChange={(e) => setGuestForm({ ...guestForm, guestPhone: e.target.value })}
                      className={`w-full border rounded p-2 text-xs focus:outline-none ${
                        formErrors.guestPhone ? "border-red-500" : "border-neutral-300"
                      }`}
                    />
                    {formErrors.guestPhone && (
                      <p className="text-red-600 text-[11px] mt-1">{formErrors.guestPhone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="guestEmail" className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="guestEmail"
                      type="email"
                      required
                      placeholder="aarav@example.com"
                      value={guestForm.guestEmail}
                      onChange={(e) => setGuestForm({ ...guestForm, guestEmail: e.target.value })}
                      className={`w-full border rounded p-2 text-xs focus:outline-none ${
                        formErrors.guestEmail ? "border-red-500" : "border-neutral-300"
                      }`}
                    />
                    {formErrors.guestEmail && (
                      <p className="text-red-600 text-[11px] mt-1">{formErrors.guestEmail}</p>
                    )}
                  </div>
                </div>

                {/* ID Type */}
                <div>
                  <label htmlFor="idType" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Photo ID Type Brought at Check-in <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="idType"
                    value={guestForm.idType}
                    onChange={(e) =>
                      setGuestForm({ ...guestForm, idType: e.target.value as AcceptedIDType })
                    }
                    className="w-full border border-neutral-300 rounded p-2 text-xs focus:outline-none bg-white"
                  >
                    {ACCEPTED_ID_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Original physical ID or DigiLocker card to be presented at front desk.
                  </p>
                </div>

                {/* Special Requests */}
                <div>
                  <label htmlFor="specialRequests" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="specialRequests"
                    rows={2}
                    placeholder="e.g. Early check-in inquiry or ground floor room"
                    value={guestForm.specialRequests}
                    onChange={(e) =>
                      setGuestForm({ ...guestForm, specialRequests: e.target.value })
                    }
                    className="w-full border border-neutral-300 rounded p-2 text-xs focus:outline-none"
                  />
                </div>

                {/* Policy Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={guestForm.isAdult}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, isAdult: e.target.checked })
                      }
                      className="mt-0.5 rounded border-neutral-300 text-neutral-900"
                    />
                    <span>
                      I confirm that the primary guest checking in is <strong>18 years of age or older</strong>.
                    </span>
                  </label>
                  {formErrors.isAdult && (
                    <p className="text-red-600 text-[11px]">{formErrors.isAdult}</p>
                  )}

                  <label className="flex items-start gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={guestForm.acceptsPolicies}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, acceptsPolicies: e.target.checked })
                      }
                      className="mt-0.5 rounded border-neutral-300 text-neutral-900"
                    />
                    <span>
                      I acknowledge and accept property policies: <strong>no male-only groups</strong>, <strong>no local IDs</strong>, and presentation of non-local government photo ID.
                    </span>
                  </label>
                  {formErrors.acceptsPolicies && (
                    <p className="text-red-600 text-[11px]">{formErrors.acceptsPolicies}</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-medium text-xs rounded transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-white font-medium text-xs rounded transition flex items-center gap-1.5"
                  style={{ backgroundColor: "var(--color-accent)" }}
                >
                  Proceed to Review <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: REVIEW & PAY */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Step 3: Review & Complete Payment</h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Review your booking details and confirm with Razorpay payment.
                </p>
              </div>

              {paymentError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Review details */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded space-y-3 text-xs">
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">Room Selected:</span>
                  <span className="font-bold text-neutral-900">{selectedRoom?.name}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">Dates & Duration:</span>
                  <span className="font-semibold text-neutral-800">
                    {checkIn} to {checkOut} ({nights} night{nights > 1 ? "s" : ""})
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">Guests:</span>
                  <span className="font-semibold text-neutral-800">{guestsCount} Guest(s)</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">Primary Guest:</span>
                  <span className="font-semibold text-neutral-800">
                    {guestForm.guestName} ({guestForm.guestPhone})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Verification ID:</span>
                  <span className="font-semibold text-neutral-800">{guestForm.idType}</span>
                </div>
              </div>

              {/* Cancellation & Policy Notice */}
              <div className="p-3 bg-neutral-100 border border-neutral-200 rounded text-xs text-neutral-700 space-y-1">
                <div className="font-semibold text-neutral-900">Cancellation Terms:</div>
                <p>Free cancellation until 24 hours before check-in (10:30 AM). Full refund processed within 5-7 business days.</p>
              </div>

              {/* Demo mode UPI hint */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
                <CreditCard className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                <span>
                  <strong>Demo Mode Hint:</strong> Test mode: use UPI <code>success@razorpay</code>. No real money is charged.
                </span>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={isPaying}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-medium text-xs rounded transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleInitiatePayment}
                  disabled={isPaying}
                  className="px-6 py-2.5 text-white font-bold text-xs rounded transition flex items-center gap-2 shadow-sm"
                  style={{ backgroundColor: "var(--color-accent)" }}
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Pay ₹{pricing.total} with Razorpay
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Total / Pricing Summary Card */}
        <div className="bg-neutral-50 border border-neutral-200 rounded p-5 space-y-4 text-xs">
          <h2 className="font-bold text-sm text-neutral-900 border-b border-neutral-200 pb-2">
            Reservation Summary
          </h2>

          <div className="space-y-2 text-neutral-600">
            <div className="flex justify-between">
              <span>Room:</span>
              <span className="font-semibold text-neutral-900 truncate max-w-[150px]">
                {selectedRoom?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{nights} night{nights > 1 ? "s" : ""}</span>
            </div>
            <div className="flex justify-between">
              <span>Base Rate:</span>
              <span>₹{pricing.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & GST:</span>
              <span>₹{pricing.tax}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-neutral-900 border-t border-neutral-300 pt-2">
              <span>Total Payable</span>
              <span>₹{pricing.total}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-200 text-[11px] text-neutral-500 space-y-1">
            <div className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Instant Confirmation
            </div>
            <div>Free cancellation up to 24 hours before check-in.</div>
          </div>
        </div>
      </div>

      {/* Mock Razorpay Checkout Dialog */}
      {showMockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-neutral-300 max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="border-b border-neutral-200 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Razorpay Test Gateway</h3>
                <p className="text-[11px] text-neutral-500">Simulated Payment Checkout</p>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">
                TEST MODE
              </span>
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Payable Amount:</span>
                <span className="font-bold text-neutral-900">₹{pricing.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Simulated VPA / UPI:</span>
                <span className="font-mono text-neutral-800">success@razorpay</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Clicking &quot;Authorize Simulated Payment&quot; triggers order verification and records the booking without charging any real funds.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowMockModal(false)}
                disabled={isPaying}
                className="flex-1 py-2 text-xs border border-neutral-300 text-neutral-700 rounded hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmMockPayment}
                disabled={isPaying}
                className="flex-1 py-2 text-xs text-white font-bold rounded transition flex items-center justify-center gap-1"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                {isPaying ? <Loader2 className="w-3 h-3 animate-spin" /> : "Authorize Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-neutral-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-400" />
          Loading booking form...
        </div>
      }
    >
      <BookingFlow />
    </Suspense>
  );
}
