"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type BookingTab = "sleep" | "eat" | "meet";
export type CursorVariant = "default" | "drag" | "explore" | "view";

export interface UIContextType {
  // Booking Drawer
  isBookingOpen: boolean;
  bookingTab: BookingTab;
  bookingMode: BookingTab;
  openBooking: (tab?: BookingTab) => void;
  closeBooking: () => void;
  setBookingMode: (tab: BookingTab) => void;
  setBookingTab: (tab: BookingTab) => void;

  // Nav Overlay
  isNavOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
  toggleNav: () => void;

  // Header Scroll State
  isScrolled: boolean;

  // Custom Cursor
  cursorLabel: string;
  cursorText: string;
  cursorVariant: CursorVariant;
  isCursorActive: boolean;
  setCursor: (label: string, active?: boolean) => void;
  setCursorText: (text: string) => void;
  setCursorVariant: (variant: CursorVariant) => void;
  resetCursor: () => void;

  // 3D Walkthrough Modal
  isWalkthroughOpen: boolean;
  activeMapHotspot: string | null;
  active3DModal: string | null;
  openWalkthrough: (hotspotId: string) => void;
  closeWalkthrough: () => void;
  open3DModal: (landmarkId: string) => void;
  close3DModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingMode, setBookingModeState] = useState<BookingTab>("sleep");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cursorText, setCursorTextState] = useState("");
  const [cursorVariant, setCursorVariantState] = useState<CursorVariant>("default");
  const [isCursorActive, setIsCursorActive] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollPos > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeHotspot) setActiveHotspot(null);
        else if (isBookingOpen) setIsBookingOpen(false);
        else if (isNavOpen) setIsNavOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeHotspot, isBookingOpen, isNavOpen]);

  const openBooking = (tab: BookingTab = "sleep") => {
    setBookingModeState(tab);
    setIsBookingOpen(true);
    setIsNavOpen(false);
  };

  const closeBooking = () => setIsBookingOpen(false);
  const setBookingMode = (tab: BookingTab) => setBookingModeState(tab);
  const setBookingTab = (tab: BookingTab) => setBookingModeState(tab);

  const openNav = () => {
    setIsNavOpen(true);
    setIsBookingOpen(false);
  };
  const closeNav = () => setIsNavOpen(false);
  const toggleNav = () => setIsNavOpen((prev) => !prev);

  const setCursor = (label: string, active: boolean = true) => {
    setCursorTextState(label);
    setIsCursorActive(active);
  };

  const setCursorText = (text: string) => {
    setCursorTextState(text);
    setIsCursorActive(Boolean(text));
  };

  const setCursorVariant = (variant: CursorVariant) => {
    setCursorVariantState(variant);
    setIsCursorActive(variant !== "default");
  };

  const resetCursor = () => {
    setCursorTextState("");
    setCursorVariantState("default");
    setIsCursorActive(false);
  };

  const openWalkthrough = (hotspotId: string) => setActiveHotspot(hotspotId);
  const closeWalkthrough = () => setActiveHotspot(null);
  const open3DModal = (landmarkId: string) => setActiveHotspot(landmarkId);
  const close3DModal = () => setActiveHotspot(null);

  return (
    <UIContext.Provider
      value={{
        isBookingOpen,
        bookingTab: bookingMode,
        bookingMode,
        openBooking,
        closeBooking,
        setBookingMode,
        setBookingTab,
        isNavOpen,
        openNav,
        closeNav,
        toggleNav,
        isScrolled,
        cursorLabel: cursorText,
        cursorText,
        cursorVariant,
        isCursorActive,
        setCursor,
        setCursorText,
        setCursorVariant,
        resetCursor,
        isWalkthroughOpen: Boolean(activeHotspot),
        activeMapHotspot: activeHotspot,
        active3DModal: activeHotspot,
        openWalkthrough,
        closeWalkthrough,
        open3DModal,
        close3DModal
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
