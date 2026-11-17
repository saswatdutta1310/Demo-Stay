"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUI } from "@/context/UIContext";

export function CustomCursor() {
  const { cursorLabel, isCursorActive } = useUI();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const pos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (touch || reducedMotion) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    const onMouseMove = (e: MouseEvent) => {
      pos.current.targetX = e.clientX;
      pos.current.targetY = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    let animationFrameId: number;
    const render = () => {
      pos.current.x += (pos.current.targetX - pos.current.x) * 0.2;
      pos.current.y += (pos.current.targetY - pos.current.y) * 0.2;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) scale(${
          isCursorActive ? 1 : 0
        })`;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isCursorActive]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isCursorActive ? "active" : ""}`}
      aria-hidden="true"
    >
      <span className="font-serif text-[12px] uppercase tracking-wider font-semibold text-midnight">
        {cursorLabel}
      </span>
    </div>
  );
}
