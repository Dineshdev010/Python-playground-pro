import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type SoundType = "click" | "drop" | "toast" | "success" | "error";

type SoundContextValue = {
  muted: boolean;
  toggleMuted: () => void;
  playSound: (type: SoundType) => void;
};

const SOUND_PREF_KEY = "pymaster_sound_muted";

const SoundContext = createContext<SoundContextValue | null>(null);

function getStoredMutePreference() {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(SOUND_PREF_KEY);
  // Default to muted so first-time users don't hear unexpected tones.
  if (stored === null) return true;
  return stored === "true";
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState<boolean>(getStoredMutePreference);
  const audioContextRef = useRef<AudioContext | null>(null);
  const observedToastNodes = useRef(new WeakSet<Element>());

  const ensureAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioContextRef.current) {
      const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      audioContextRef.current = new Ctx();
    }
    if (audioContextRef.current.state === "suspended") {
      void audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, durationMs: number, gainValue: number) => {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  }, [ensureAudioContext]);

  const playSound = useCallback((type: SoundType) => {
    if (muted) return;

    if (type === "click") {
      playTone(520, 55, 0.015);
      return;
    }
    if (type === "drop") {
      playTone(360, 65, 0.02);
      playTone(520, 80, 0.018);
      return;
    }
    if (type === "toast") {
      playTone(640, 90, 0.02);
      return;
    }
    if (type === "success") {
      playTone(520, 80, 0.02);
      playTone(740, 100, 0.018);
      return;
    }
    if (type === "error") {
      playTone(220, 120, 0.02);
      return;
    }
  }, [muted, playTone]);

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      if (typeof window !== "undefined") {
        localStorage.setItem(SOUND_PREF_KEY, String(next));
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (target.closest("button, a, [role='button']")) {
        playSound("click");
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [playSound]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;

          const toastNode =
            node.matches?.("[data-sonner-toast]") ? node : node.querySelector?.("[data-sonner-toast]");
          if (toastNode && !observedToastNodes.current.has(toastNode)) {
            observedToastNodes.current.add(toastNode);
            playSound("toast");
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [playSound]);

  const value = useMemo(() => ({ muted, toggleMuted, playSound }), [muted, toggleMuted, playSound]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return ctx;
}
