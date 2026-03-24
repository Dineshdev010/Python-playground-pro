import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dot } from "lucide-react";

const names = [
  "Harry",
  "Ava",
  "Riya",
  "Noah",
  "Mia",
  "Arjun",
  "Sara",
  "Leo",
  "Isha",
  "Kai",
  "Zara",
  "Ethan",
];

const events = [
  "finished Binary Search Basics",
  "solved Two Sum",
  "completed a Python functions lesson",
  "extended their coding streak to 7 days",
  "earned 40 XP from arrays practice",
  "unlocked the next lesson chapter",
  "submitted a clean solution in the compiler",
  "caught all 3 daily stars",
  "solved Daily Temperatures",
  "completed a DSA warmup sprint",
  "earned a new trophy on the leaderboard",
  "finished a recursion practice set",
];

function createMessage(seed: number) {
  const name = names[seed % names.length];
  const event = events[(seed * 7) % events.length];
  return `${name} ${event}`;
}

export function LiveActivityFeed() {
  const initialIndex = useMemo(() => Math.floor(Date.now() / 6000), []);
  const [messageIndex, setMessageIndex] = useState(initialIndex);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((current) => current + 1);
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  const message = createMessage(messageIndex);

  return (
    <div className="w-full max-w-[280px]">
      <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-background/85 px-2.5 py-1 text-[11px] shadow-lg backdrop-blur-md">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="shrink-0 font-semibold text-foreground">Live</span>
        <Dot className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
        <div className="min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={message}
              className="truncate text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              {message}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
