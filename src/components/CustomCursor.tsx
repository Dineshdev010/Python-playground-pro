import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useLocation } from "react-router-dom";

const TRAIL_COUNT = 6;

type CursorMode = "playful" | "focused" | "elegant" | "coding" | "default";

type Burst = {
  id: number;
  x: number;
  y: number;
};

type CursorTheme = {
  magneticPull: number;
  trailColor: string;
  auraBackground: string;
  ringHoverBorder: string;
  ringIdleBorder: string;
  ringHoverBackground: string;
  ringIdleBackground: string;
  ringHoverShadow: string;
  ringIdleShadow: string;
  coreBackground: string;
  coreHoverShadow: string;
  coreIdleShadow: string;
  burstBorder: string;
  burstShadow: string;
  sparkBackground: string;
  auraHoverSize: number;
  auraIdleSize: number;
  ringHoverSize: number;
  ringIdleSize: number;
  coreHoverSize: number;
  coreIdleSize: number;
};

const cursorThemes: Record<CursorMode, CursorTheme> = {
  playful: {
    magneticPull: 0.16,
    trailColor: "rgb(251 191 36)",
    auraBackground:
      "radial-gradient(circle, rgba(251,191,36,0.34) 0%, rgba(249,115,22,0.18) 38%, rgba(236,72,153,0.07) 72%, transparent 100%)",
    ringHoverBorder: "rgba(251,191,36,0.92)",
    ringIdleBorder: "rgba(251,191,36,0.38)",
    ringHoverBackground: "rgba(251,191,36,0.16)",
    ringIdleBackground: "rgba(255,255,255,0.03)",
    ringHoverShadow: "0 0 30px rgba(251,191,36,0.42), inset 0 0 16px rgba(249,115,22,0.22)",
    ringIdleShadow: "0 0 14px rgba(251,191,36,0.18), inset 0 0 10px rgba(251,191,36,0.08)",
    coreBackground:
      "radial-gradient(circle at 30% 30%, rgba(255,255,255,1) 0%, rgba(253,224,71,0.98) 35%, rgba(249,115,22,1) 100%)",
    coreHoverShadow: "0 0 24px rgba(251,191,36,0.95), 0 0 44px rgba(249,115,22,0.42)",
    coreIdleShadow: "0 0 14px rgba(251,191,36,0.72)",
    burstBorder: "rgba(253,224,71,0.96)",
    burstShadow: "0 0 26px rgba(251,191,36,0.42)",
    sparkBackground:
      "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(253,224,71,0.96) 45%, rgba(249,115,22,0) 100%)",
    auraHoverSize: 118,
    auraIdleSize: 82,
    ringHoverSize: 74,
    ringIdleSize: 40,
    coreHoverSize: 15,
    coreIdleSize: 11,
  },
  focused: {
    magneticPull: 0.07,
    trailColor: "rgb(96 165 250)",
    auraBackground:
      "radial-gradient(circle, rgba(96,165,250,0.24) 0%, rgba(59,130,246,0.14) 38%, rgba(2,132,199,0.04) 72%, transparent 100%)",
    ringHoverBorder: "rgba(96,165,250,0.95)",
    ringIdleBorder: "rgba(96,165,250,0.3)",
    ringHoverBackground: "rgba(96,165,250,0.08)",
    ringIdleBackground: "rgba(255,255,255,0.02)",
    ringHoverShadow: "0 0 18px rgba(96,165,250,0.34), inset 0 0 12px rgba(59,130,246,0.14)",
    ringIdleShadow: "0 0 10px rgba(96,165,250,0.12), inset 0 0 6px rgba(96,165,250,0.05)",
    coreBackground:
      "radial-gradient(circle at 30% 30%, rgba(255,255,255,1) 0%, rgba(147,197,253,0.96) 35%, rgba(59,130,246,1) 100%)",
    coreHoverShadow: "0 0 18px rgba(96,165,250,0.7), 0 0 30px rgba(59,130,246,0.28)",
    coreIdleShadow: "0 0 10px rgba(96,165,250,0.45)",
    burstBorder: "rgba(147,197,253,0.95)",
    burstShadow: "0 0 18px rgba(96,165,250,0.28)",
    sparkBackground:
      "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(147,197,253,0.96) 45%, rgba(59,130,246,0) 100%)",
    auraHoverSize: 84,
    auraIdleSize: 58,
    ringHoverSize: 54,
    ringIdleSize: 30,
    coreHoverSize: 12,
    coreIdleSize: 8,
  },
  elegant: {
    magneticPull: 0.1,
    trailColor: "rgb(167 139 250)",
    auraBackground:
      "radial-gradient(circle, rgba(167,139,250,0.26) 0%, rgba(192,132,252,0.14) 38%, rgba(244,114,182,0.04) 72%, transparent 100%)",
    ringHoverBorder: "rgba(196,181,253,0.94)",
    ringIdleBorder: "rgba(196,181,253,0.32)",
    ringHoverBackground: "rgba(196,181,253,0.1)",
    ringIdleBackground: "rgba(255,255,255,0.03)",
    ringHoverShadow: "0 0 26px rgba(167,139,250,0.28), inset 0 0 14px rgba(244,114,182,0.12)",
    ringIdleShadow: "0 0 12px rgba(167,139,250,0.12), inset 0 0 8px rgba(196,181,253,0.06)",
    coreBackground:
      "radial-gradient(circle at 30% 30%, rgba(255,255,255,1) 0%, rgba(221,214,254,0.96) 35%, rgba(167,139,250,1) 100%)",
    coreHoverShadow: "0 0 22px rgba(196,181,253,0.74), 0 0 34px rgba(167,139,250,0.22)",
    coreIdleShadow: "0 0 12px rgba(196,181,253,0.46)",
    burstBorder: "rgba(221,214,254,0.95)",
    burstShadow: "0 0 20px rgba(167,139,250,0.24)",
    sparkBackground:
      "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(221,214,254,0.96) 45%, rgba(167,139,250,0) 100%)",
    auraHoverSize: 96,
    auraIdleSize: 66,
    ringHoverSize: 60,
    ringIdleSize: 34,
    coreHoverSize: 13,
    coreIdleSize: 9,
  },
  default: {
    magneticPull: 0.12,
    trailColor: "rgb(56 189 248)",
    auraBackground:
      "radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(59,130,246,0.16) 38%, rgba(16,185,129,0.04) 72%, transparent 100%)",
    ringHoverBorder: "rgba(56,189,248,0.9)",
    ringIdleBorder: "rgba(56,189,248,0.35)",
    ringHoverBackground: "rgba(56,189,248,0.14)",
    ringIdleBackground: "rgba(255,255,255,0.03)",
    ringHoverShadow: "0 0 30px rgba(56,189,248,0.45), inset 0 0 16px rgba(96,165,250,0.22)",
    ringIdleShadow: "0 0 14px rgba(56,189,248,0.16), inset 0 0 10px rgba(56,189,248,0.08)",
    coreBackground:
      "radial-gradient(circle at 30% 30%, rgba(255,255,255,1) 0%, rgba(125,211,252,0.95) 38%, rgba(14,165,233,1) 100%)",
    coreHoverShadow: "0 0 24px rgba(56,189,248,0.95), 0 0 44px rgba(59,130,246,0.45)",
    coreIdleShadow: "0 0 14px rgba(56,189,248,0.7)",
    burstBorder: "rgba(125, 211, 252, 0.95)",
    burstShadow: "0 0 26px rgba(56,189,248,0.45)",
    sparkBackground:
      "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(125,211,252,0.95) 45%, rgba(14,165,233,0) 100%)",
    auraHoverSize: 110,
    auraIdleSize: 72,
    ringHoverSize: 68,
    ringIdleSize: 36,
    coreHoverSize: 14,
    coreIdleSize: 10,
  },
  coding: {
    magneticPull: 0,
    trailColor: "rgb(16 185 129)",
    auraBackground:
      "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(5,150,105,0.15) 38%, rgba(6,78,59,0.05) 72%, transparent 100%)",
    ringHoverBorder: "rgba(16,185,129,0.95)",
    ringIdleBorder: "rgba(16,185,129,0.4)",
    ringHoverBackground: "rgba(16,185,129,0.1)",
    ringIdleBackground: "rgba(0,0,0,0.2)",
    ringHoverShadow: "0 0 20px rgba(16,185,129,0.4), inset 0 0 10px rgba(16,185,129,0.2)",
    ringIdleShadow: "0 0 10px rgba(16,185,129,0.15)",
    coreBackground:
      "radial-gradient(circle at 30% 30%, rgba(255,255,255,1) 0%, rgba(110,231,183,0.98) 35%, rgba(16,185,129,1) 100%)",
    coreHoverShadow: "0 0 20px rgba(16,185,129,0.8)",
    coreIdleShadow: "0 0 10px rgba(16,185,129,0.5)",
    burstBorder: "rgba(16,185,129,0.95)",
    burstShadow: "0 0 20px rgba(16,185,129,0.3)",
    sparkBackground:
      "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(110,231,183,0.95) 45%, rgba(16,185,129,0) 100%)",
    auraHoverSize: 90,
    auraIdleSize: 60,
    ringHoverSize: 46,
    ringIdleSize: 28,
    coreHoverSize: 10,
    coreIdleSize: 6,
  },
};

function TrailDot({
  cursorX,
  cursorY,
  index,
  isPointerReady,
  trailColor,
}: {
  cursorX: ReturnType<typeof useMotionValue<number>>;
  cursorY: ReturnType<typeof useMotionValue<number>>;
  index: number;
  isPointerReady: boolean;
  trailColor: string;
}) {
  const damping = 26 + index * 2;
  const stiffness = 280 - index * 16;
  const mass = 0.35 + index * 0.08;
  const x = useSpring(cursorX, { damping, stiffness, mass });
  const y = useSpring(cursorY, { damping, stiffness, mass });
  const size = Math.max(6, 18 - index);
  const opacity = Math.max(0.06, 0.32 - index * 0.025);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 hidden rounded-full bg-primary md:block"
      style={{
        x,
        y,
        width: size,
        height: size,
        opacity: isPointerReady ? opacity : 0,
        translateX: "-50%",
        translateY: "-50%",
        zIndex: 9990 - index,
        filter: "blur(10px)",
        backgroundColor: trailColor,
      }}
    />
  );
}

export function CustomCursor() {
  const location = useLocation();
  const cursorX = useMotionValue<number>(-100);
  const cursorY = useMotionValue<number>(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isCoding, setIsCoding]     = useState(false);
  const [isPointerReady, setIsPointerReady] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);

    const baseMode: CursorMode =
      location.pathname === "/"
        ? "focused"
        : location.pathname.startsWith("/compiler") || location.pathname.startsWith("/problems")
          ? "focused"
          : location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/certificate")
            ? "elegant"
            : "default";
  
    const cursorMode: CursorMode = isCoding ? "coding" : baseMode;
    const theme = cursorThemes[cursorMode];

  const coreSpring = { damping: 34, stiffness: 420, mass: 0.28 };
  const ringSpring = { damping: 40, stiffness: 190, mass: 0.9 };
  const auraSpring = { damping: 46, stiffness: 135, mass: 1.2 };

  const cursorXSpring = useSpring(cursorX, coreSpring);
  const cursorYSpring = useSpring(cursorY, coreSpring);
  const ringXSpring = useSpring(cursorX, ringSpring);
  const ringYSpring = useSpring(cursorY, ringSpring);
  const auraXSpring = useSpring(cursorX, auraSpring);
  const auraYSpring = useSpring(cursorY, auraSpring);

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const moveCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactiveTarget = target?.closest(
        "button, a, [role='button'], [role='menuitem'], .cursor-pointer",
      ) as HTMLElement | null;

      let nextX = e.clientX;
      let nextY = e.clientY;

      if (interactiveTarget) {
        const rect = interactiveTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        nextX += (centerX - e.clientX) * theme.magneticPull;
        nextY += (centerY - e.clientY) * theme.magneticPull;
      }

      cursorX.set(nextX);
      cursorY.set(nextY);

      if (!isPointerReady) {
        setIsPointerReady(true);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(target);
      const cursor = computedStyle.cursor;

      const isClickable =
        cursor === "pointer" ||
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        !!target.closest("button") ||
        !!target.closest("a") ||
        !!target.closest("[role='button']") ||
        !!target.closest("[role='menuitem']") ||
        String(target.className).includes("cursor-pointer");

      const isHeading =
        /^(H[1-6])$/i.test(target.tagName) ||
        !!target.closest("h1, h2, h3, h4, h5, h6");

      const isEditorSurface =
        !!target.closest(".monaco-editor") ||
        !!target.closest("pre") ||
        !!target.closest("code") ||
        !!target.closest(".workshop-arena") || // for the puzzle game
        String(target.className).includes("monaco-mouse-cursor-text");

      setIsHovering(isClickable || isHeading || isEditorSurface);
      setIsCoding(isEditorSurface);
    };

    const handleClick = (e: MouseEvent) => {
      const burstId = Date.now() + Math.floor(Math.random() * 1000);
      const burst = { id: burstId, x: e.clientX, y: e.clientY };

      setBursts((current) => [...current.slice(-4), burst]);
      window.setTimeout(() => {
        setBursts((current) => current.filter((item) => item.id !== burstId));
      }, 650);
    };

    const handleMouseLeave = () => {
      setIsPointerReady(false);
      cursorX.set(-100);
      cursorY.set(-100);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", handleClick);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, isPointerReady, theme.magneticPull]);

  if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      {bursts.map((burst) => (
        <motion.div
          key={burst.id}
          className="pointer-events-none fixed left-0 top-0 hidden rounded-full border md:block"
          style={{
            x: burst.x,
            y: burst.y,
            translateX: "-50%",
            translateY: "-50%",
            zIndex: 10001,
            borderColor: theme.burstBorder,
            boxShadow: theme.burstShadow,
          }}
          initial={{ width: 8, height: 8, opacity: 0.9 }}
          animate={{ width: 86, height: 86, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      ))}

      {bursts.map((burst) => (
        <motion.div
          key={`${burst.id}-spark`}
          className="pointer-events-none fixed left-0 top-0 hidden rounded-full md:block"
          style={{
            x: burst.x,
            y: burst.y,
            translateX: "-50%",
            translateY: "-50%",
            zIndex: 10002,
            background: theme.sparkBackground,
            filter: "blur(2px)",
          }}
          initial={{ width: 10, height: 10, opacity: 1, scale: 0.8 }}
          animate={{ width: 32, height: 32, opacity: 0, scale: 1.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      ))}

      {Array.from({ length: TRAIL_COUNT }, (_, index) => (
        <TrailDot
          key={index}
          cursorX={cursorX}
          cursorY={cursorY}
          index={index}
          isPointerReady={isPointerReady}
          trailColor={theme.trailColor}
        />
      ))}

      <motion.div
        className="pointer-events-none fixed left-0 top-0 hidden rounded-full md:block"
        style={{
          x: auraXSpring,
          y: auraYSpring,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9996,
          background: theme.auraBackground,
          filter: "blur(8px)",
        }}
        animate={{
          width: theme.auraIdleSize,
          height: theme.auraIdleSize,
          opacity: isPointerReady ? 1 : 0,
          scale: 1,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 28 }}
      />

      <motion.div
        className="pointer-events-none fixed left-0 top-0 hidden rounded-full border md:block"
        style={{
          x: ringXSpring,
          y: ringYSpring,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9998,
        }}
        animate={{
          width: theme.ringIdleSize,
          height: theme.ringIdleSize,
          opacity: isPointerReady ? 1 : 0,
          borderColor: isHovering ? theme.ringHoverBorder : theme.ringIdleBorder,
          backgroundColor: isHovering ? theme.ringHoverBackground : theme.ringIdleBackground,
          boxShadow: isHovering
            ? theme.ringHoverShadow
            : theme.ringIdleShadow,
        }}
        transition={{ type: "spring", stiffness: 360, damping: 24 }}
      />

      <motion.div
        className="pointer-events-none fixed left-0 top-0 hidden rounded-full md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 10000,
          background: theme.coreBackground,
        }}
        animate={{
          width: theme.coreIdleSize,
          height: theme.coreIdleSize,
          opacity: isPointerReady ? 1 : 0,
          boxShadow: isHovering
            ? theme.coreHoverShadow
            : theme.coreIdleShadow,
        }}
        transition={{ type: "spring", stiffness: 520, damping: 28 }}
      />
    </>
  );
}
