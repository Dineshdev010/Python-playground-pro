import confetti from "canvas-confetti";

const brandColors = ["#FFD700", "#3B82F6", "#22C55E", "#F59E0B", "#A855F7", "#FB7185"];

export function fireRewardConfetti(origin?: { x?: number; y?: number }) {
  const baseOrigin = {
    x: origin?.x ?? 0.5,
    y: origin?.y ?? 0.55,
  };

  confetti({
    particleCount: 36,
    angle: 60,
    spread: 60,
    startVelocity: 42,
    gravity: 1.05,
    ticks: 220,
    scalar: 0.95,
    origin: baseOrigin,
    colors: brandColors,
  });

  confetti({
    particleCount: 36,
    angle: 120,
    spread: 60,
    startVelocity: 42,
    gravity: 1.05,
    ticks: 220,
    scalar: 0.95,
    origin: baseOrigin,
    colors: brandColors,
  });

  confetti({
    particleCount: 24,
    spread: 90,
    startVelocity: 28,
    gravity: 0.95,
    ticks: 180,
    scalar: 1.15,
    origin: baseOrigin,
    colors: brandColors,
  });
}
