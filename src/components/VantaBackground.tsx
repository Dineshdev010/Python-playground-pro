import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function VantaBackground() {
  const { theme } = useTheme();
  const [isPageVisible, setIsPageVisible] = useState(true);
  
  // High-performance Framer Motion values instead of React State (Fixes page hangs!)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Add a slight spring physics for buttery smooth following without lag
  const springConfig = { stiffness: 35, damping: 24, mass: 0.7 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable animations on low-end devices
    if ("ontouchstart" in window && navigator.maxTouchPoints > 0) {
      // Mobile device - don't track mouse
      return;
    }

    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse moves to requestAnimationFrame
      if (!ticking) {
        window.requestAnimationFrame(() => {
          mouseX.set((e.clientX / window.innerWidth - 0.5) * 10);
          mouseY.set((e.clientY / window.innerHeight - 0.5) * 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const isDark = theme === "dark";

  // Construct parallax variables to inject directly into styles
  const x1 = useTransform(smoothX, (v) => v * 0.24);
  const y1 = useTransform(smoothY, (v) => v * 0.24);
  const x2 = useTransform(smoothX, (v) => v * -0.45);
  const y2 = useTransform(smoothY, (v) => v * -0.45);
  const x3 = useTransform(smoothX, (v) => v * -0.8);
  const y3 = useTransform(smoothY, (v) => v * -0.8);
  const x4 = useTransform(smoothX, (v) => v * -1.1);
  const y4 = useTransform(smoothY, (v) => v * -1.1);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-background">
      {/* Sky Gradient Header */}
      <div 
        className="absolute inset-0 transition-colors duration-1000 ease-in-out"
        style={{
          background: isDark 
            ? "linear-gradient(to bottom, #030712 0%, #0f172a 100%)" // Deep space / dark sky
            : "linear-gradient(to bottom, #38bdf8 0%, #bae6fd 100%)"   // Vibrant sky blue
        }}
      />
      
      {/* Sun / Moon layer */}
      <motion.div
        className="absolute w-96 h-96 rounded-full mix-blend-screen blur-3xl opacity-50"
        style={{
          background: isDark ? "#2563eb" : "#fbbf24", // Moonlight vs Sunlight glow
          right: "10%",
          top: "5%",
          x: x1,
          y: y1,
        }}
        animate={isPageVisible ? { scale: [1, 1.05, 1], opacity: [0.28, 0.42, 0.28] } : { scale: 1, opacity: 0.3 }}
        transition={{ duration: 10, repeat: isPageVisible ? Infinity : 0, ease: "easeInOut" }}
      />

      {/* Cloud Layer 1 - Slow Background Clouds */}
      <motion.div 
        className="absolute inset-x-0 bottom-[10%] h-[60vh] flex items-end opacity-60 mix-blend-screen"
        style={{ x: x2, y: y2 }}
      >
        <motion.div 
          className="flex shrink-0 w-[200vw] h-full items-end"
          animate={isPageVisible ? { x: ["0%", "-50%"] } : { x: "0%" }}
          transition={{ duration: 160, repeat: isPageVisible ? Infinity : 0, ease: "linear" }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 h-full rounded-t-full blur-3xl scale-y-150"
              style={{
                background: isDark ? "rgba(51, 65, 85, 0.4)" : "rgba(255, 255, 255, 0.7)"
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Cloud Layer 2 - Midground Clouds */}
      <motion.div 
        className="absolute inset-x-0 bottom-[0%] h-[40vh] flex items-end opacity-90"
        style={{ x: x3, y: y3 }}
      >
        <motion.div 
          className="flex shrink-0 w-[200vw] h-full items-end"
          animate={isPageVisible ? { x: ["-50%", "0%"] } : { x: "-50%" }}
          transition={{ duration: 120, repeat: isPageVisible ? Infinity : 0, ease: "linear" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 h-[90%] rounded-t-[100%] blur-2xl scale-y-125"
              style={{
                background: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.9)"
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Cloud Layer 3 - Fast Foreground Clouds (Solid Base) */}
      <motion.div 
        className="absolute inset-x-0 bottom-[-20%] h-[30vh] flex items-end"
        style={{ x: x4, y: y4 }}
      >
        <motion.div 
          className="flex shrink-0 w-[200vw] h-full items-end"
          animate={isPageVisible ? { x: ["0%", "-50%"] } : { x: "0%" }}
          transition={{ duration: 72, repeat: isPageVisible ? Infinity : 0, ease: "linear" }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 h-full rounded-t-[100%] blur-xl scale-y-150"
              style={{
                background: isDark ? "#0f172a" : "#f8fafc"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
