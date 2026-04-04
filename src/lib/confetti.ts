// src/lib/confetti.ts

/**
 * Fires the new heavy-rain global confetti effect using react-confetti.
 * This triggers a custom window event that the <GlobalConfetti /> listener inside App.tsx catches.
 */
export function fireRewardConfetti(durationMs: number = 7000) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fire-confetti", { detail: { duration: durationMs } }));
  }
}
