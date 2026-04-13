import { useEffect, useMemo, useState } from "react";

import { useTheme } from "@/components/ThemeProvider";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

type Variant = "day" | "night" | "twilight";

export function SkyBackground() {
  const { theme } = useTheme();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [clockIsNight, setClockIsNight] = useState(() => {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18;
  });

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const updatePhase = () => {
      const hour = new Date().getHours();
      setClockIsNight(hour < 6 || hour >= 18);
    };
    updatePhase();
    const interval = window.setInterval(updatePhase, 2 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  const variant: Variant = useMemo(() => {
    if (theme === "light") return "day";
    return clockIsNight ? "night" : "twilight";
  }, [clockIsNight, theme]);

  const base = useMemo(() => {
    if (variant === "day") {
      return "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.16) 56%, rgba(255,255,255,0.0) 72%), linear-gradient(180deg, rgba(186,230,253,0.96) 0%, rgba(125,211,252,0.72) 28%, rgba(224,242,254,0.5) 62%, rgba(248,250,252,0.96) 100%)";
    }
    if (variant === "twilight") {
      return "radial-gradient(ellipse at 55% 0%, rgba(56,189,248,0.22) 0%, rgba(56,189,248,0.0) 55%), linear-gradient(180deg, rgba(2,6,23,0.94) 0%, rgba(15,23,42,0.92) 45%, rgba(2,6,23,0.98) 100%)";
    }
    return "radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.10) 0%, rgba(56,189,248,0.0) 60%), linear-gradient(180deg, rgba(2,6,23,0.96) 0%, rgba(3,7,18,0.98) 55%, rgba(2,6,23,1) 100%)";
  }, [variant]);

  const glow = useMemo(() => {
    if (variant === "day") {
      return "radial-gradient(circle at 78% 18%, rgba(250,204,21,0.46) 0%, rgba(250,204,21,0.08) 28%, rgba(250,204,21,0.0) 48%)";
    }
    if (variant === "twilight") {
      return "radial-gradient(circle at 72% 18%, rgba(56,189,248,0.16) 0%, rgba(56,189,248,0.0) 48%), radial-gradient(circle at 20% 24%, rgba(168,85,247,0.10) 0%, rgba(168,85,247,0.0) 55%)";
    }
    return "radial-gradient(circle at 22% 20%, rgba(226,232,240,0.18) 0%, rgba(226,232,240,0.0) 46%)";
  }, [variant]);

  const cloudLayer = useMemo(() => {
    const alpha = variant === "day" ? 0.26 : variant === "twilight" ? 0.14 : 0.08;
    return `radial-gradient(ellipse at 14% 34%, rgba(255,255,255,${alpha}) 0%, rgba(255,255,255,${alpha * 0.58}) 18%, rgba(255,255,255,0) 52%),
radial-gradient(ellipse at 48% 28%, rgba(255,255,255,${alpha * 0.92}) 0%, rgba(255,255,255,${alpha * 0.46}) 20%, rgba(255,255,255,0) 56%),
radial-gradient(ellipse at 82% 40%, rgba(255,255,255,${alpha * 0.82}) 0%, rgba(255,255,255,${alpha * 0.38}) 22%, rgba(255,255,255,0) 58%)`;
  }, [variant]);

  const starsLayer = useMemo(() => {
    if (variant !== "night") return null;
    return "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.9) 0 1px, transparent 2px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.85) 0 1px, transparent 2px), radial-gradient(circle at 60% 55%, rgba(255,255,255,0.8) 0 1px, transparent 2px), radial-gradient(circle at 35% 70%, rgba(255,255,255,0.75) 0 1px, transparent 2px)";
  }, [variant]);

  const animateClouds = !reducedMotion;
  const animateTwinkle = !reducedMotion && variant === "night";

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-background">
      {/* Local keyframes so we don't pollute global CSS */}
      <style>
        {`
          @keyframes skyCloudDrift {
            0% { transform: translate3d(-6%, 0, 0) scale(1.02); }
            50% { transform: translate3d(6%, -1.2%, 0) scale(1.03); }
            100% { transform: translate3d(-6%, 0, 0) scale(1.02); }
          }
          @keyframes skyCloudDriftReverse {
            0% { transform: translate3d(5%, 0.5%, 0) scale(1.03); }
            50% { transform: translate3d(-5%, -1%, 0) scale(1.01); }
            100% { transform: translate3d(5%, 0.5%, 0) scale(1.03); }
          }
          @keyframes skyPulse {
            0% { opacity: 0.72; transform: scale(0.98); }
            50% { opacity: 0.9; transform: scale(1.03); }
            100% { opacity: 0.72; transform: scale(0.98); }
          }
          @keyframes skyTwinkle {
            0% { opacity: 0.22; }
            50% { opacity: 0.40; }
            100% { opacity: 0.22; }
          }
        `}
      </style>

      {/* Base sky */}
      <div className="absolute inset-0" style={{ background: base }} />

      {/* Sun / moon body */}
      <div
        className="absolute rounded-full"
        style={{
          top: variant === "day" ? "10%" : "11%",
          right: variant === "day" ? "14%" : "16%",
          width: variant === "day" ? "180px" : "120px",
          height: variant === "day" ? "180px" : "120px",
          background:
            variant === "day"
              ? "radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(254,240,138,0.96) 34%, rgba(250,204,21,0.78) 58%, rgba(250,204,21,0) 78%)"
              : "radial-gradient(circle, rgba(255,255,255,0.92) 0%, rgba(226,232,240,0.72) 38%, rgba(226,232,240,0.0) 72%)",
          opacity: variant === "twilight" ? 0.78 : 1,
          animation: !reducedMotion ? "skyPulse 9s ease-in-out infinite" : undefined,
        }}
      />

      {/* Sun/Moon glow */}
      <div className="absolute inset-0 mix-blend-screen" style={{ background: glow, opacity: variant === "day" ? 0.95 : 0.7 }} />

      {/* Daylight rays */}
      {variant === "day" ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 18%, rgba(255,255,255,0.0) 40%), radial-gradient(ellipse at 74% 6%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.12) 28%, rgba(255,255,255,0.0) 58%)",
          }}
        />
      ) : null}

      {/* Stars (night only) */}
      {starsLayer ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: starsLayer,
            backgroundSize: "520px 420px",
            opacity: 0.28,
            animation: animateTwinkle ? "skyTwinkle 6s ease-in-out infinite" : undefined,
          }}
        />
      ) : null}

      {/* Soft atmosphere bands */}
      <div
        className="absolute inset-x-0 bottom-0 h-[32%]"
        style={{
          background:
            variant === "day"
              ? "linear-gradient(180deg, rgba(255,255,255,0.0) 0%, rgba(240,249,255,0.48) 35%, rgba(255,255,255,0.78) 100%)"
              : "linear-gradient(180deg, rgba(2,6,23,0.0) 0%, rgba(15,23,42,0.2) 32%, rgba(2,6,23,0.44) 100%)",
        }}
      />

      {/* Clouds haze */}
      <div
        className="absolute -inset-6"
        style={{
          backgroundImage: cloudLayer,
          backgroundSize: "140% 140%",
          opacity: variant === "day" ? 0.95 : 0.82,
          animation: animateClouds ? "skyCloudDrift 46s ease-in-out infinite" : undefined,
        }}
      />

      {/* Secondary cloud bank for more shape in daylight */}
      <div
        className="absolute inset-x-[-6%] top-[16%] h-[30%] blur-[4px]"
        style={{
          backgroundImage:
            variant === "day"
              ? "radial-gradient(ellipse at 14% 52%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.34) 24%, rgba(255,255,255,0.0) 54%), radial-gradient(ellipse at 44% 40%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.28) 24%, rgba(255,255,255,0.0) 52%), radial-gradient(ellipse at 76% 48%, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.24) 26%, rgba(255,255,255,0.0) 54%)"
              : "radial-gradient(ellipse at 20% 50%, rgba(148,163,184,0.16) 0%, rgba(148,163,184,0.06) 22%, rgba(148,163,184,0.0) 54%), radial-gradient(ellipse at 72% 42%, rgba(148,163,184,0.1) 0%, rgba(148,163,184,0.03) 22%, rgba(148,163,184,0.0) 52%)",
          opacity: variant === "day" ? 0.92 : 0.68,
          animation: animateClouds ? "skyCloudDriftReverse 60s ease-in-out infinite" : undefined,
        }}
      />

      {/* Subtle pattern texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            variant === "day"
              ? "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)"
              : "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.05) 55%, transparent 100%)",
          opacity: variant === "day" ? 0.22 : 0.14,
        }}
      />

      {/* Soft vignette to keep content readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === "day"
              ? "radial-gradient(circle at 50% 22%, rgba(255,255,255,0.0) 0%, rgba(148,163,184,0.14) 62%, rgba(226,232,240,0.26) 100%)"
              : "radial-gradient(circle at 50% 25%, rgba(255,255,255,0.0) 0%, rgba(2,6,23,0.72) 82%)",
        }}
      />
    </div>
  );
}

