import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);

  // Snappy follower dot
  const springConfig = { damping: 20, stiffness: 600, mass: 0.2 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Smooth lens trailing ring
  const springConfigRing = { damping: 30, stiffness: 200, mass: 0.8 };
  const ringXSpring = useSpring(cursorX, springConfigRing);
  const ringYSpring = useSpring(cursorY, springConfigRing);

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(target);
      const cursor = computedStyle.cursor;
      
      // Check if it's interactive (button, link, pointer cursor, nav items, icons)
      const isClickable = 
        cursor === "pointer" ||
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "nav" ||
        target.tagName.toLowerCase() === "header" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("nav") ||
        target.closest("header") ||
        target.closest("[role='menuitem']") ||
        target.className?.includes("nav") ||
        target.className?.includes("cursor-pointer");
      
      // Only zoom on HEADINGS and IMPORTANT text (h1-h6), NOT regular paragraphs
      const isHeading = 
        target.tagName.match(/^(H[1-6])$/) ||
        /^(h[1-6])$/i.test(target.tagName) ||
        target.closest("h1") ||
        target.closest("h2") ||
        target.closest("h3") ||
        target.closest("h4") ||
        target.closest("h5") ||
        target.closest("h6");
      
      // Zoom effect only on clickable elements and headings
      setIsHovering(isClickable || isHeading);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Core Pointer Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-primary rounded-full pointer-events-none z-[10000] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 0 : 1,
        }}
      />
      
      {/* The Lens Effect Ring - Zooms on any hover */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block border-2 border-primary/40 overflow-hidden"
        style={{
          x: ringXSpring,
          y: ringYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 70 : 44,
          height: isHovering ? 70 : 44,
          boxShadow: isHovering 
            ? "0 0 50px hsla(var(--primary), 0.7), inset 0 0 30px hsla(var(--primary), 0.6), 0 0 80px hsla(var(--primary), 0.4)" 
            : "0 0 10px hsla(var(--primary), 0.2), inset 0 0 5px hsla(var(--primary), 0.1)",
          backgroundColor: isHovering ? "hsla(var(--primary), 0.25)" : "rgba(var(--background), 0.05)",
          borderColor: isHovering ? "hsl(var(--primary))" : "hsla(var(--primary), 0.3)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </>
  );
}
