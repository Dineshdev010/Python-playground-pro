import { useProgress } from "@/contexts/ProgressContext";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { getEffectiveDailyStars } from "@/lib/progress";

export function DailyWantedLevel() {
  const { progress } = useProgress();
  const dailyStars = getEffectiveDailyStars(progress);

  if (dailyStars >= 3) {
    return null;
  }
  
  // Create an array of 3 booleans depending on how many stars the user has
  const starsArray = [
    dailyStars >= 1,
    dailyStars >= 2,
    dailyStars >= 3
  ];

  return (
    <div className="fixed right-3 top-[4.15rem] z-[998] pointer-events-none sm:right-4">
      <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-background/85 px-2.5 py-1 text-[11px] shadow-lg backdrop-blur-md">
        {starsArray.map((isCaught, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Star 
              className={`h-3.5 w-3.5 transition-all duration-500 ${
                isCaught 
                  ? "fill-yellow-400 text-yellow-500 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" 
                  : "fill-transparent text-muted-foreground/40"
              }`}
            />
          </motion.div>
        ))}
        <span className="pl-0.5 font-semibold text-foreground">
          Daily Tasks
        </span>
      </div>
    </div>
  );
}
