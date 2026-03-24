import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOUR_KEY = "pymaster_tour_completed";

interface TourStep {
  title: string;
  description: string;
  emoji: string;
  target: string; // nav label to highlight
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to PyMaster! 🐍",
    description: "Let us show you around. This quick tour will help you navigate the platform and start your Python journey!",
    emoji: "👋",
    target: "",
  },
  {
    title: "Home",
    description: "Your starting point. See your progress, featured content, and quick access to all sections.",
    emoji: "🏠",
    target: "Home",
  },
  {
    title: "Learn Python",
    description: "Step-by-step Python lessons from basics to advanced. Each lesson includes examples and exercises.",
    emoji: "📖",
    target: "Learn",
  },
  {
    title: "DSA Mastery",
    description: "Master Data Structures & Algorithms with curated problems and visual explanations.",
    emoji: "🧠",
    target: "DSA",
  },
  {
    title: "Compiler",
    description: "Write and run Python code directly in your browser. No setup needed!",
    emoji: "💻",
    target: "Compiler",
  },
  {
    title: "Problems",
    description: "Practice with 180+ coding problems across Junior, Intermediate, and Expert levels.",
    emoji: "🔥",
    target: "Problems",
  },
  {
    title: "Python Jobs",
    description: "Explore real Python job opportunities and prepare for your career.",
    emoji: "💼",
    target: "Python",
  },
  {
    title: "Leaderboard",
    description: "Compete with other learners! Earn XP by solving problems and catching stars.",
    emoji: "🏆",
    target: "Leaderboard",
  },
  {
    title: "Dashboard",
    description: "Track your learning progress, streak, XP earned, and activity heatmap.",
    emoji: "📊",
    target: "Dashboard",
  },
  {
    title: "Donate",
    description: "Support PyMaster via UPI/GPay to help keep the platform free for everyone.",
    emoji: "❤️",
    target: "Donate",
  },
  {
    title: "You're all set!",
    description: "Start learning Python now. Catch the ⭐ stars that appear on screen to earn bonus XP! Good luck! 🐍",
    emoji: "🚀",
    target: "",
  },
];

export function OnboardingTour() {
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const hasCompletedTour = localStorage.getItem(TOUR_KEY) === "true";
    setCompleted(hasCompletedTour);

    if (!hasCompletedTour) {
      // Show tour after a short delay
      const timeout = setTimeout(() => setActive(true), 2000);
      return () => clearTimeout(timeout);
    }
  }, []);

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleClose = () => {
    setActive(false);
    localStorage.setItem(TOUR_KEY, "true");
    setCompleted(true);
  };

  const handleRestart = () => {
    setStep(0);
    setActive(true);
  };

  const current = tourSteps[step];
  const isFirst = step === 0;
  const isLast = step === tourSteps.length - 1;

  return (
    <>
      {/* Restart tour button — small, bottom-left */}
      {!active && !completed && (
        <motion.button
          onClick={handleRestart}
          className="fixed bottom-20 left-4 lg:bottom-6 lg:left-6 z-40 flex items-center gap-1.5 px-3 py-2 rounded-full bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
        >
          <Sparkles className="w-3.5 h-3.5 text-python-yellow" />
          Tour
        </motion.button>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

            {/* Tour card */}
            <motion.div
              key={step}
              className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Step indicator */}
              <div className="flex items-center gap-1 mb-4">
                {tourSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i === step
                        ? "w-6 bg-primary"
                        : i < step
                        ? "w-3 bg-primary/40"
                        : "w-3 bg-border"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <motion.span
                  className="text-4xl block mb-3"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  {current.emoji}
                </motion.span>
                <h3 className="text-lg font-bold text-foreground mb-2">{current.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>

                {/* Highlight which nav item */}
                {current.target && (
                  <motion.div
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span>Look for</span>
                    <span className="font-bold">"{current.target}"</span>
                    <span>in the navbar</span>
                  </motion.div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrev}
                  disabled={isFirst}
                  className="gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </Button>

                <span className="text-xs text-muted-foreground">
                  {step + 1} / {tourSteps.length}
                </span>

                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-1"
                >
                  {isLast ? "Get Started" : "Next"}
                  {!isLast && <ArrowRight className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
