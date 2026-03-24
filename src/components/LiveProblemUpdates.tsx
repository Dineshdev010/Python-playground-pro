import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const names = ["Ava", "Riya", "Noah", "Harry", "Sara", "Leo", "Mia", "Isha", "Kai", "Zara"];
const actions = [
  "finished",
  "just solved",
  "cleared all tests for",
  "submitted a clean answer for",
  "wrapped up",
  "passed",
];

interface LiveProblemUpdatesProps {
  problemTitle: string;
}

function createUpdate(seed: number, problemTitle: string) {
  const name = names[seed % names.length];
  const action = actions[(seed * 5) % actions.length];
  return `${name} ${action} ${problemTitle}`;
}

export function LiveProblemUpdates({ problemTitle }: LiveProblemUpdatesProps) {
  const initialSeed = useMemo(() => Math.floor(Date.now() / 7000), []);
  const [seed, setSeed] = useState(initialSeed);

  useEffect(() => {
    const interval = window.setInterval(() => setSeed((current) => current + 1), 7000);
    return () => window.clearInterval(interval);
  }, []);

  const message = createUpdate(seed, problemTitle);

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 hidden sm:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          className="max-w-xs rounded-2xl border border-border/60 bg-background/85 px-4 py-3 text-sm shadow-[0_18px_40px_rgba(15,23,42,0.18)] backdrop-blur-md"
          initial={{ opacity: 0, y: 16, x: -12 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Live Solve
            </span>
          </div>
          <p className="text-foreground">{message}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
