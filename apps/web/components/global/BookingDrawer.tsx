"use client";

import React, { useState } from "react";
import { useUI } from "@/context/UIContext";
import { siteContent } from "@/config/siteContent";
import { X, Check, ArrowRight } from "lucide-react";

export function BookingDrawer() {
  const { isBookingOpen, closeBooking, bookingTab, openBooking } = useUI();

  // Sleep State
  const [checkIn, setCheckIn] = useState("2026-12-01");
  const [checkOut, setCheckOut] = useState("2026-12-05");
  const [roomsCount, setRoomsCount] = useState(1);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [promoCode, setPromoCode] = useState("");

  // Eat State
  const [restaurant, setRestaurant] = useState("Morii Restaurant & Cellar");
  const [diningDate, setDiningDate] = useState("2026-12-02");
  const [diningTime, setDiningTime] = useState("19:00");
  const [partySize, setPartySize] = useState(2);
  const [eatSubmitted, setEatSubmitted] = useState(false);

  // Meet State
  const [meetName, setMeetName] = useState("");
  const [meetEmail, setMeetEmail] = useState("");
  const [meetPhone, setMeetPhone] = useState("");
  const [eventType, setEventType] = useState("Conference");
  const [delegates, setDelegates] = useState(25);
  const [meetDate, setMeetDate] = useState("2026-12-15");
  const [meetNotes, setMeetNotes] = useState("");
  const [meetSubmitted, setMeetSubmitted] = useState(false);

  if (!isBookingOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-drawer-title"
    >
      {/* Backdrop */}
      <div
        onClick={closeBooking}
        className="fixed inset-0 bg-midnight/50 backdrop-blur-sm transition-opacity duration-500 ease-expo"
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-cream shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-silt/30 transition-transform duration-500 ease-expo">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-silt/20 flex items-center justify-between">
            <div>
              <h2
                id="booking-drawer-title"
                className="font-serif text-2xl text-midnight tracking-tight"
              >
                Reservations & Inquiries
              </h2>
              <p className="font-sans text-xs text-wood tracking-wider uppercase mt-1">
                {siteContent.brand.name}
              </p>
            </div>

            <button
              onClick={closeBooking}
              className="w-10 h-10 rounded-full border border-silt/40 flex items-center justify-center text-midnight hover:border-terracotta hover:text-terracotta transition-colors"
              aria-label="Close booking drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs (Sleep / Eat / Meet) */}
          <div className="px-6 sm:px-8 pt-6">
            <div
              className="grid grid-cols-3 p-1 rounded-full bg-pebble border border-silt/30 text-xs font-sans uppercase tracking-wider font-medium text-center"
              role="tablist"
              aria-label="Reservation Type"
            >
              <button
                role="tab"
                aria-selected={bookingTab === "sleep"}
                onClick={() => openBooking("sleep")}
                className={`py-2 px-3 rounded-full transition-all duration-300 ${
                  bookingTab === "sleep"
                    ? "bg-terracotta text-cream shadow-sm"
                    : "text-midnight/70 hover:text-midnight"
                }`}
              >
                Sleep
              </button>
              <button
                role="tab"
                aria-selected={bookingTab === "eat"}
                onClick={() => openBooking("eat")}
                className={`py-2 px-3 rounded-full transition-all duration-300 ${
                  bookingTab === "eat"
                    ? "bg-terracotta text-cream shadow-sm"
                    : "text-midnight/70 hover:text-midnight"
                }`}
              >
                Eat
              </button>
              <button
                role="tab"
                aria-selected={bookingTab === "meet"}
                onClick={() => openBooking("meet")}
                className={`py-2 px-3 rounded-full transition-all duration-300 ${
                  bookingTab === "meet"
                    ? "bg-terracotta text-cream shadow-sm"
                    : "text-midnight/70 hover:text-midnight"
                }`}
              >
                Meet
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 sm:p-8 space-y-6">
            {/* 1. SLEEP TAB */}
            {bookingTab === "sleep" && (
              <form
                action="/book"
                method="GET"
                className="space-y-5"
                onSubmit={() => closeBooking()}
              >
                {/* Dates Selection */}
                <div className="space-y-3">
                  <label className="block font-sans text-xs uppercase tracking-wider text-wood font-medium">
                    Dates of Stay
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-satin border border-silt/40 rounded-xl">
                      <span className="block text-[10px] uppercase font-mono text-wood">
                        Check-in
                      </span>
                      <input
                        type="date"
                        name="checkIn"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-transparent font-sans text-sm text-midnight font-medium focus:outline-none mt-1"
                        required
                      />
                    </div>
                    <div className="p-3 bg-satin border border-silt/40 rounded-xl">
                      <span className="block text-[10px] uppercase font-mono text-wood">
                        Check-out
                      </span>
                      <input
                        type="date"
                        name="checkOut"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-transparent font-sans text-sm text-midnight font-medium focus:outline-none mt-1"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Rooms and Guests Counter */}
                <div className="p-4 bg-satin border border-silt/40 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-sans text-sm font-medium text-midnight">Rooms</p>
                      <p className="text-[11px] text-wood">Total guest rooms</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}
                        className="w-7 h-7 rounded-full border border-silt/60 flex items-center justify-center text-midnight hover:border-terracotta"
                      >
                        -
                      </button>
                      <span className="font-sans text-sm font-semibold w-5 text-center">
                        {roomsCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setRoomsCount(roomsCount + 1)}
                        className="w-7 h-7 rounded-full border border-silt/60 flex items-center justify-center text-midnight hover:border-terracotta"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-silt/20 pt-3">
                    <div>
                      <p className="font-sans text-sm font-medium text-midnight">Adults</p>
                      <p className="text-[11px] text-wood">Ages 13 and above</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                        className="w-7 h-7 rounded-full border border-silt/60 flex items-center justify-center text-midnight hover:border-terracotta"
                      >
                        -
                      </button>
                      <span className="font-sans text-sm font-semibold w-5 text-center">
                        {adultsCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdultsCount(adultsCount + 1)}
                        className="w-7 h-7 rounded-full border border-silt/60 flex items-center justify-center text-midnight hover:border-terracotta"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-silt/20 pt-3">
                    <div>
                      <p className="font-sans text-sm font-medium text-midnight">Children</p>
                      <p className="text-[11px] text-wood">Ages 0 to 12</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        className="w-7 h-7 rounded-full border border-silt/60 flex items-center justify-center text-midnight hover:border-terracotta"
                      >
                        -
                      </button>
                      <span className="font-sans text-sm font-semibold w-5 text-center">
                        {childrenCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildrenCount(childrenCount + 1)}
                        className="w-7 h-7 rounded-full border border-silt/60 flex items-center justify-center text-midnight hover:border-terracotta"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div>
                  <label
                    htmlFor="promoCode"
                    className="block font-sans text-xs uppercase tracking-wider text-wood font-medium mb-1.5"
                  >
                    Promotional / Corporate Code
                  </label>
                  <input
                    id="promoCode"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. HERITAGE2026"
                    className="w-full px-4 py-2.5 bg-satin border border-silt/40 rounded-xl font-sans text-sm text-midnight focus:border-terracotta focus:outline-none"
                  />
                </div>

                {/* Direct Booking Perks Note */}
                <div className="p-3 bg-pebble/70 rounded-xl text-xs text-wood space-y-1">
                  <p className="font-semibold text-midnight">Direct Reservation Benefits:</p>
                  <p>✓ Guaranteed lowest rate with complimentary daily wine tasting.</p>
                  <p>✓ Free date amendment up to 48 hours prior to arrival.</p>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-terracotta text-cream font-sans text-xs uppercase tracking-[0.15em] font-semibold hover:bg-midnight transition-colors shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Check Availability</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 2. EAT TAB */}
            {bookingTab === "eat" && (
              <div className="space-y-5">
                {eatSubmitted ? (
                  <div className="p-6 bg-forest/10 border border-forest/30 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-forest text-cream flex items-center justify-center">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg text-midnight">Table Request Received</h3>
                    <p className="font-sans text-xs text-wood">
                      We look forward to hosting you at {restaurant} on {diningDate} at {diningTime}.
                      A confirmation SMS has been dispatched.
                    </p>
                    <button
                      onClick={() => setEatSubmitted(false)}
                      className="text-xs text-terracotta font-medium underline mt-2"
                    >
                      Book another reservation
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setEatSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-wider text-wood font-medium mb-1.5">
                        Restaurant Venue
                      </label>
                      <select
                        value={restaurant}
                        onChange={(e) => setRestaurant(e.target.value)}
                        className="w-full px-4 py-3 bg-satin border border-silt/40 rounded-xl font-sans text-sm text-midnight focus:outline-none"
                      >
                        <option>Morii Restaurant & Cellar</option>
                        <option>The Garden Lounge & High Tea</option>
                        <option>The Courtyard Cobblestone Patio</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-wider text-wood font-medium mb-1.5">
                          Date
                        </label>
                        <input
                          type="date"
                          value={diningDate}
                          onChange={(e) => setDiningDate(e.target.value)}
                          className="w-full px-3 py-2.5 bg-satin border border-silt/40 rounded-xl font-sans text-sm text-midnight focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-wider text-wood font-medium mb-1.5">
                          Seating Time
                        </label>
                        <select
                          value={diningTime}
                          onChange={(e) => setDiningTime(e.target.value)}
                          className="w-full px-3 py-2.5 bg-satin border border-silt/40 rounded-xl font-sans text-sm text-midnight focus:outline-none"
                        >
                          <option>12:30 (Lunch)</option>
                          <option>13:30 (Lunch)</option>
                          <option>15:00 (High Tea)</option>
                          <option>18:30 (Dinner)</option>
                          <option>19:00 (Dinner)</option>
                          <option>20:00 (Dinner)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-xs uppercase tracking-wider text-wood font-medium mb-1.5">
                        Party Size
                      </label>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 4, 6, 8].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setPartySize(size)}
                            className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                              partySize === size
                                ? "bg-midnight text-cream border-midnight"
                                : "bg-satin text-midnight border-silt/40 hover:border-terracotta"
                            }`}
                          >
                            {size} {size === 8 ? "8+" : ""}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-terracotta text-cream font-sans text-xs uppercase tracking-[0.15em] font-semibold hover:bg-midnight transition-colors shadow-md mt-4"
                    >
                      Reserve Table
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 3. MEET TAB */}
            {bookingTab === "meet" && (
              <div className="space-y-5">
                {meetSubmitted ? (
                  <div className="p-6 bg-forest/10 border border-forest/30 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-forest text-cream flex items-center justify-center">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg text-midnight">Inquiry Dispatched</h3>
                    <p className="font-sans text-xs text-wood">
                      Thank you, {meetName}. Our dedicated event curator will contact you within 24
                      hours with floorplans and bespoke catering proposals.
                    </p>
                    <button
                      onClick={() => setMeetSubmitted(false)}
                      className="text-xs text-terracotta font-medium underline mt-2"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setMeetSubmitted(true);
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-wider text-wood font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={meetName}
                        onChange={(e) => setMeetName(e.target.value)}
                        placeholder="e.g. Victoria Sterling"
                        className="w-full px-3 py-2 bg-satin border border-silt/40 rounded-xl font-sans text-sm text-midnight focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-wider text-wood font-medium mb-1">
                          Work Email
                        </label>
                        <input
                          type="email"
                          value={meetEmail}
                          onChange={(e) => setMeetEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full px-3 py-2 bg-satin border border-silt/40 rounded-xl font-sans text-sm text-midnight focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-wider text-wood font-medium mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={meetPhone}
                          onChange={(e) => setMeetPhone(e.target.value)}
                          placeholder="+27 (0)21..."
                          className="w-full px-3 py-2 bg-satin border border-silt/40 rounded-xl font-sans text-sm text-midnight focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-wider text-wood font-medium mb-1">
                          Event Type
                        </label>
                        <select
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value)}
                          className="w-full px-3 py-2 bg-satin border border-silt/40 rounded-xl font-sans text-sm text-midnight focus:outline-none"
                        >
                          <option>Conference</option>
                          <option>Executive Boardroom</option>
                          <option>Bespoke Wedding</option>
                          <option>Cocktail Reception</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-wider text-wood font-medium mb-1">
                          Delegates: {delegates}
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="250"
                          step="5"
                          value={delegates}
                          onChange={(e) => setDelegates(Number(e.target.value))}
                          className="w-full accent-terracotta mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-xs uppercase tracking-wider text-wood font-medium mb-1">
                        Estimated Date
                      </label>
                      <input
                        type="date"
                        value={meetDate}
                        onChange={(e) => setMeetDate(e.target.value)}
                        className="w-full px-3 py-2 bg-satin border border-silt/40 rounded-xl font-sans text-sm text-midnight focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-xs uppercase tracking-wider text-wood font-medium mb-1">
                        Specific Requirements
                      </label>
                      <textarea
                        rows={2}
                        value={meetNotes}
                        onChange={(e) => setMeetNotes(e.target.value)}
                        placeholder="Audiovisual requirements, catering preferences..."
                        className="w-full px-3 py-2 bg-satin border border-silt/40 rounded-xl font-sans text-xs text-midnight focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-midnight text-cream font-sans text-xs uppercase tracking-[0.15em] font-semibold hover:bg-terracotta transition-colors shadow-md mt-2"
                    >
                      Submit Event RFP
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer Assistance */}
          <div className="p-6 border-t border-silt/20 bg-pebble/40 text-center">
            <p className="font-sans text-xs text-wood">
              Need assistance? Call our concierge desk directly at{" "}
              <a
                href={`tel:${siteContent.brand.contact.phone.replace(/[^0-9+]/g, "")}`}
                className="font-medium text-midnight underline hover:text-terracotta"
              >
                {siteContent.brand.contact.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

