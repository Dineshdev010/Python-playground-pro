import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/contexts/ProgressContext";
import { toast } from "sonner";
import { pythonRiddles } from "@/data/pythonRiddles";
import confetti from "canvas-confetti";

const ANSWERED_RIDDLES_KEY = "pymaster_answered_riddles";
const LAST_RIDDLE_KEY = "pymaster_last_riddle";

function getUnseenRiddle(starsCaught: number): typeof pythonRiddles[0] {
  let answered: number[] = [];
  let lastIdx = -1;
  try {
    answered = JSON.parse(localStorage.getItem(ANSWERED_RIDDLES_KEY) || "[]");
    lastIdx = parseInt(localStorage.getItem(LAST_RIDDLE_KEY) || "-1", 10);
  } catch {
    // Reset riddle history if local storage is unavailable.
  }
  
  // Filter out answered riddles AND the last shown riddle to avoid consecutive repeats
  let candidates = pythonRiddles
    .map((r, i) => ({ r, i }))
    .filter(({ i, r }) => {
      if (answered.includes(i) || i === lastIdx) return false;
      // Difficulty Scaling Math
      // Basic initially. Escalate as they catch more stars.
      const diff = r.difficulty || 'basic';
      if (starsCaught < 15 && diff !== 'basic') return false;
      if (starsCaught >= 15 && starsCaught < 30 && ['advanced', 'expert'].includes(diff)) return false;
      if (starsCaught >= 30 && starsCaught < 50 && diff === 'expert') return false;
      return true;
    });
  
  if (candidates.length === 0) {
    // All answered — reset, but still avoid last shown
    localStorage.setItem(ANSWERED_RIDDLES_KEY, "[]");
    candidates = pythonRiddles
      .map((r, i) => ({ r, i }))
      .filter(({ i }) => i !== lastIdx);
    if (candidates.length === 0) {
      candidates = pythonRiddles.map((r, i) => ({ r, i }));
    }
  }
  
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  localStorage.setItem(LAST_RIDDLE_KEY, String(pick.i));
  return pick.r;
}

function markRiddleAnswered(riddle: typeof pythonRiddles[0]) {
  const idx = pythonRiddles.indexOf(riddle);
  if (idx === -1) return;
  let answered: number[] = [];
  try {
    answered = JSON.parse(localStorage.getItem(ANSWERED_RIDDLES_KEY) || "[]");
  } catch {
    // Ignore malformed answered-riddle cache and rebuild it.
  }
  if (!answered.includes(idx)) {
    answered.push(idx);
    localStorage.setItem(ANSWERED_RIDDLES_KEY, JSON.stringify(answered));
  }
}

type SpawnSide = "top" | "bottom" | "left" | "right";

interface Star {
  id: number;
  x: number;
  y: number;
  angle: number;
  side: SpawnSide;
  riddle: typeof pythonRiddles[0];
}

function getRandomSidePosition(): { x: number; y: number; side: SpawnSide } {
  const sides: SpawnSide[] = ["top", "bottom", "left", "right"];
  const side = sides[Math.floor(Math.random() * sides.length)];
  switch (side) {
    case "top":
      return { x: Math.random() * 80 + 10, y: 2, side };
    case "bottom":
      return { x: Math.random() * 80 + 10, y: 85, side };
    case "left":
      return { x: 2, y: Math.random() * 60 + 15, side };
    case "right":
      return { x: 92, y: Math.random() * 60 + 15, side };
  }
}

function getTargetPosition(side: SpawnSide): { tx: number; ty: number } {
  switch (side) {
    case "top":
      return { tx: Math.random() * 40 + 30, ty: Math.random() * 20 + 35 };
    case "bottom":
      return { tx: Math.random() * 40 + 30, ty: Math.random() * 20 + 30 };
    case "left":
      return { tx: Math.random() * 20 + 35, ty: Math.random() * 40 + 25 };
    case "right":
      return { tx: Math.random() * 20 + 30, ty: Math.random() * 40 + 25 };
  }
}

export function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);
  const [showRiddle, setShowRiddle] = useState<{ star: Star; answer: string } | null>(null);
  const [burstPos, setBurstPos] = useState<{ x: number; y: number } | null>(null);
  const { progress, catchStar, addDailyStar } = useProgress();
  const idCounter = useRef(0);
  const starsCaughtRef = useRef(progress.starsCaught);
  
  useEffect(() => {
    starsCaughtRef.current = progress.starsCaught;
  }, [progress.starsCaught]);

  const spawnStar = useCallback(() => {
    const riddle = getUnseenRiddle(starsCaughtRef.current);
    const { x, y, side } = getRandomSidePosition();
    const newStar: Star = {
      id: idCounter.current++,
      x,
      y,
      angle: Math.random() * 360,
      side,
      riddle,
    };
    setStars(prev => [...prev, newStar]);
    setTimeout(() => {
      setStars(prev => prev.filter(s => s.id !== newStar.id));
    }, 15000);
  }, []);

  useEffect(() => {
    // Random spawn: initial delay 8-20s, then random intervals 60-180s
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 120000) + 60000; // 60-180 seconds
      return setTimeout(() => {
        spawnStar();
        timeoutRef.current = scheduleNext();
      }, delay);
    };
    
    const timeoutRef = { current: null as ReturnType<typeof setTimeout> | null };
    const initialDelay = Math.floor(Math.random() * 12000) + 8000; // 8-20 seconds
    const initialTimeout = setTimeout(() => {
      spawnStar();
      timeoutRef.current = scheduleNext();
    }, initialDelay);
    
    return () => {
      clearTimeout(initialTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [spawnStar]);

  const handleCatchStar = (star: Star, e: React.MouseEvent) => {
    setBurstPos({ x: e.clientX, y: e.clientY });
    setStars(prev => prev.filter(s => s.id !== star.id));
    setShowRiddle({ star, answer: "" });
  };

  const triggerBurst = (x: number, y: number) => {
    confetti({
      particleCount: 60, // Reduced from 80 for better performance, keeps visual impact
      spread: 70,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: ["#FFD700", "#3B82F6", "#22C55E", "#F59E0B"],
      gravity: 1.2,
      scalar: 1, // Kept at 1 for impact - stars are important
      decay: 0.95, // Faster particle decay for better performance
    });
  };

  const submitAnswer = () => {
    if (!showRiddle) return;
    const correct = showRiddle.answer.trim().toLowerCase().replace(/\s/g, "") ===
      showRiddle.star.riddle.a.toLowerCase().replace(/\s/g, "");
    
    if (correct) {
      markRiddleAnswered(showRiddle.star.riddle);
      const xpGain = Math.floor(Math.random() * 30) + 10;
      catchStar(xpGain);
      addDailyStar();
      if (burstPos) triggerBurst(burstPos.x, burstPos.y);
      toast.success(`💥 Star Burst! +${xpGain} XP`, {
        description: `Answer: ${showRiddle.star.riddle.a}`,
      });
    } else {
      toast.error("Wrong answer! Try next time 🌟", {
        description: `Correct answer: ${showRiddle.star.riddle.a}`,
      });
    }
    setShowRiddle(null);
    setBurstPos(null);
  };

  return (
    <>
      <AnimatePresence>
        {stars.map(star => {
          const target = getTargetPosition(star.side);
          const dx = ((target.tx - star.x) / 100) * window.innerWidth;
          const dy = ((target.ty - star.y) / 100) * window.innerHeight;
          return (
            <motion.div
              key={star.id}
              className="fixed z-50 cursor-pointer"
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0.8],
                scale: [0, 1.2, 1, 1.1],
                x: [0, dx * 0.5, dx, dx + 5],
                y: [0, dy * 0.5, dy, dy - 5],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 3, ease: "easeOut" }}
              onClick={(e) => handleCatchStar(star, e)}
            >
              <div className="relative group">
                <div className="absolute inset-0 w-12 h-12 -m-3 rounded-full bg-python-yellow/30 blur-xl animate-pulse" />
                <div className="relative text-5xl md:text-6xl filter drop-shadow-[0_0_20px_hsl(var(--python-yellow))]">
                  ⭐
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-python-yellow font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to catch!
                </div>
                <motion.div
                  className="absolute w-1 h-1 rounded-full bg-python-yellow/60"
                  animate={{ x: [0, 20], y: [0, 15], opacity: [0.8, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ top: "50%", left: "50%" }}
                />
                <motion.div
                  className="absolute w-1 h-1 rounded-full bg-primary/60"
                  animate={{ x: [0, -15], y: [0, 20], opacity: [0.6, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  style={{ top: "50%", left: "50%" }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {showRiddle && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRiddle(null)}
          >
            <motion.div
              className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⭐</span>
                <h3 className="text-lg font-bold text-foreground">Python Riddle!</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-2">Answer correctly to earn XP:</p>
              <div className="bg-surface-2 border border-border rounded-xl p-4 mb-4 font-mono text-sm text-foreground">
                {showRiddle.star.riddle.q}
              </div>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg bg-surface-1 border border-border text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                placeholder="Your answer..."
                value={showRiddle.answer}
                onChange={e => setShowRiddle({ ...showRiddle, answer: e.target.value })}
                onKeyDown={e => e.key === "Enter" && submitAnswer()}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  className="flex-1 py-2 rounded-lg bg-surface-2 text-muted-foreground text-sm hover:bg-surface-3 transition-colors"
                  onClick={() => setShowRiddle(null)}
                >
                  Skip
                </button>
                <button
                  className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  onClick={submitAnswer}
                >
                  Submit ⚡
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
