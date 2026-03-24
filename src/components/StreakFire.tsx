import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import rocketImg from "@/assets/rocket-streak.png";

const motivationQuotes = [
  "🔥 You're on fire! Keep that Python momentum going!",
  "💪 Consistency beats talent. You're proving it!",
  "🚀 10+ days! You're becoming unstoppable!",
  "🧠 Your brain is rewiring itself for Python mastery!",
  "⚡ Champions don't skip days. You're a champion!",
  "🌟 Most people quit by day 3. You're a legend!",
  "🏆 Your future self is thanking you right now!",
  "💎 Diamonds are made under pressure. Keep coding!",
];

interface StreakFireProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  showQuote?: boolean;
}

export function StreakFire({ streak, size = "sm", showQuote = false }: StreakFireProps) {
  const [hovered, setHovered] = useState(false);

  const quote = useMemo(
    () => motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)],
    []
  );

  const sizeConfig = {
    sm: { img: 28, numSize: "text-sm" },
    md: { img: 40, numSize: "text-lg" },
    lg: { img: 56, numSize: "text-2xl" },
  };

  const config = sizeConfig[size];

  const streakColor =
    streak >= 100 ? "text-purple-400" :
    streak >= 30  ? "text-red-400" :
    streak >= 14  ? "text-orange-400" :
    streak >= 7   ? "text-python-yellow" :
    streak >= 3   ? "text-yellow-300" :
    "text-muted-foreground";

  return (
    <div
      className="relative inline-flex items-center gap-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rocket image with hover animation */}
      <motion.img
        src={rocketImg}
        alt="Streak rocket"
        width={config.img}
        height={config.img}
        className="relative z-10"
        style={{
          filter: streak >= 7
            ? `drop-shadow(0 2px ${4 + Math.min(streak, 50) * 0.12}px rgba(255,140,0,0.45))`
            : undefined,
        }}
        animate={streak >= 1 ? {
          y: [0, -3, 0, -1.5, 0],
          rotate: [0, -2, 0, 1.5, 0],
        } : undefined}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Streak number */}
      <span className={`${config.numSize} font-extrabold ${streakColor} tabular-nums`}>
        {streak}
      </span>

      {/* Hover quote tooltip */}
      <AnimatePresence>
        {hovered && showQuote && streak >= 10 && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 rounded-xl bg-card border border-border shadow-xl z-50"
          >
            <p className="text-xs text-foreground leading-relaxed text-center">{quote}</p>
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-l border-t border-border rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
