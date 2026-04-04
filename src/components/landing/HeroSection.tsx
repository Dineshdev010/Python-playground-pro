// ============================================================
// HERO SECTION — src/components/landing/HeroSection.tsx
// The main hero banner at the top of the landing page.
// Features: animated headline, CTA buttons, platform stats,
// streak display, floating code snippets, parallax scroll effect.
// Also exports the `fadeUp` animation variant used by other sections.
// ============================================================

import { Link, useNavigate } from "react-router-dom";
import { motion, type Easing } from "framer-motion";
import { ArrowRight, BookOpen, Code, Flame, Target, Sparkles, Rocket, Brain, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useProgress } from "@/contexts/ProgressContext";
import { useMemo, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { StreakFire } from "@/components/StreakFire";
import { AddToHomeScreenButton } from "@/components/AddToHomeScreenButton";

// ---------- Platform stats shown below the CTA ----------
const stats = [
  { value: "25+", label: "Python Lessons", icon: BookOpen },
  { value: "100+", label: "Coding Problems", icon: Code },
  { value: "5", label: "Difficulty Levels", icon: Target },
  { value: "∞", label: "Practice Time", icon: Flame },
];

// ---------- Shared animation variant ----------
// Used by many landing sections — fades up with staggered delay
export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as Easing } }),
};

// Continuous floating animation for decorative code snippets
const floatingAnimation = {
  y: [-8, 8, -8],
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as Easing },
};

const brandPulseAnimation = {
  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
  transition: { duration: 9, repeat: Infinity, ease: "easeInOut" as Easing },
};

const shimmerAnimation = {
  x: ["-120%", "125%"],
  transition: { duration: 2.8, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" as Easing },
};

export function HeroSection() {
  const { theme } = useTheme();
  const { progress } = useProgress();
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedGuide, setSelectedGuide] = useState<"aptitude" | "coding" | "both" | null>(null);

  // ---------- Parallax scroll effect ----------
  // As user scrolls down, the hero fades out and slightly shrinks
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const isDarkTheme = theme === "dark";

  const guide = useMemo(() => {
    const guides = {
      aptitude: {
        title: "Aptitude",
        subtitle: "Company-style sets + timed mocks",
        tone: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700",
        startTo: "/aptitude?track=beginner",
        steps: [
          "Pick 1 topic and revise formulas (3 minutes).",
          "Solve 2 MCQs without revealing the answer (4 minutes).",
          "Submit in practice mode and read the strategy line (5 minutes).",
          "Start a short mock and review wrong questions (3 minutes).",
        ],
      },
      coding: {
        title: "Python Coding",
        subtitle: "Lessons + quick practice",
        tone: "border-sky-500/25 bg-sky-500/10 text-sky-700",
        startTo: "/learn",
        steps: [
          "Open one lesson and read the key concept (4 minutes).",
          "Type and run the example in the compiler (4 minutes).",
          "Solve one basic problem with your own code (6 minutes).",
          "Re-run and confirm output matches the expected result (1 minute).",
        ],
      },
      both: {
        title: "Both",
        subtitle: "Balanced 15-minute sprint",
        tone: "border-amber-500/25 bg-amber-500/10 text-amber-700",
        startTo: "/quick-prep",
        steps: [
          "7 minutes: Quant or Reasoning practice (easy or medium).",
          "7 minutes: Solve one basic coding problem.",
          "1 minute: Note 1 mistake + 1 shortcut you learned.",
        ],
      },
    } as const;

    return selectedGuide ? guides[selectedGuide] : null;
  }, [selectedGuide]);

  const heroGlowClasses = isDarkTheme
    ? "bg-[radial-gradient(circle_at_50%_18%,rgba(15,23,42,0.82),rgba(15,23,42,0.58)_36%,rgba(15,23,42,0.22)_68%,transparent_100%)]"
    : "bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.88),rgba(255,255,255,0.72)_34%,rgba(255,255,255,0.28)_66%,transparent_100%)]";
  const heroBadgeClasses = isDarkTheme
    ? "border border-primary/30 bg-slate-950/40 text-primary shadow-[0_8px_30px_rgba(2,6,23,0.28)]"
    : "border border-sky-500/20 bg-white/75 text-sky-700 shadow-[0_10px_35px_rgba(148,163,184,0.18)]";
  const heroTitleClasses = isDarkTheme
    ? "text-foreground drop-shadow-[0_10px_30px_rgba(2,6,23,0.8)]"
    : "text-slate-950 drop-shadow-[0_10px_28px_rgba(255,255,255,0.65)]";
  const heroBrandClasses = isDarkTheme
    ? "bg-[linear-gradient(90deg,#7dd3fc_0%,#86efac_35%,#fde68a_68%,#7dd3fc_100%)] bg-[length:220%_220%] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(125,211,252,0.3)]"
    : "bg-[linear-gradient(90deg,#0369a1_0%,#059669_34%,#d97706_68%,#0369a1_100%)] bg-[length:220%_220%] bg-clip-text text-transparent drop-shadow-[0_8px_24px_rgba(255,255,255,0.32)]";
  const heroTaglineClasses = isDarkTheme
    ? "text-yellow-300 drop-shadow-[0_6px_24px_rgba(250,204,21,0.28)]"
    : "text-amber-600 drop-shadow-[0_8px_18px_rgba(255,255,255,0.42)]";
  const heroSubtitleClasses = isDarkTheme
    ? "text-slate-200/92 drop-shadow-[0_4px_20px_rgba(2,6,23,0.6)]"
    : "text-slate-700 drop-shadow-[0_8px_20px_rgba(255,255,255,0.55)]";
  const heroSubtitleBrandClasses = isDarkTheme ? "text-white" : "text-slate-950";
  const snippetCardClasses = isDarkTheme
    ? "bg-slate-950/35 border-white/10 text-slate-300"
    : "bg-white/70 border-slate-200/70 text-slate-700 shadow-[0_12px_30px_rgba(148,163,184,0.16)]";
  const streakCardClasses = isDarkTheme
    ? "bg-card/60 border-border text-muted-foreground"
    : "bg-white/75 border-slate-200/80 text-slate-700 shadow-[0_14px_35px_rgba(148,163,184,0.16)]";
  const guideCardClasses = isDarkTheme
    ? "border-border/60 bg-card/50"
    : "border-slate-200/80 bg-white/72 shadow-[0_18px_45px_rgba(148,163,184,0.16)]";
  const guideLabelClasses = isDarkTheme ? "text-muted-foreground" : "text-slate-500";
  const guideHeadingClasses = isDarkTheme ? "text-foreground" : "text-slate-900";
  const guideIdleTextClasses = isDarkTheme ? "text-muted-foreground" : "text-slate-600";
  const guideStepClasses = isDarkTheme
    ? "border-border/60 bg-background/70 text-muted-foreground"
    : "border-slate-200/80 bg-white/80 text-slate-700 shadow-[0_6px_22px_rgba(148,163,184,0.12)]";
  const choiceButtonClasses = isDarkTheme
    ? "border-border bg-background text-muted-foreground hover:text-foreground"
    : "border-slate-300/80 bg-white/85 text-slate-600 hover:text-slate-900";
  const statCardClasses = isDarkTheme
    ? "bg-card/50 border-border/50 hover:border-primary/30"
    : "bg-white/74 border-slate-200/80 shadow-[0_16px_40px_rgba(148,163,184,0.16)] hover:border-sky-400/35";
  const statLabelClasses = isDarkTheme ? "text-muted-foreground" : "text-slate-600";
  const statValueClasses = isDarkTheme ? "text-foreground" : "text-slate-950";
  const scrollHintClasses = isDarkTheme ? "text-slate-300/80" : "text-slate-600";
  const brandFrameClasses = isDarkTheme
    ? "bg-[radial-gradient(circle_at_50%_55%,rgba(15,23,42,0.2),rgba(15,23,42,0.0)_72%)]"
    : "bg-[radial-gradient(circle_at_50%_55%,rgba(255,255,255,0.18),rgba(255,255,255,0.0)_72%)]";
  const brandUnderlineClasses = isDarkTheme
    ? "bg-gradient-to-r from-sky-400/0 via-sky-300/75 to-emerald-300/0"
    : "bg-gradient-to-r from-sky-500/0 via-sky-500/70 to-amber-500/0";
  const brandGlowClasses = isDarkTheme
    ? "bg-[radial-gradient(circle,rgba(125,211,252,0.3)_0%,rgba(125,211,252,0.0)_72%)]"
    : "bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.0)_72%)]";

  return (
    <section ref={heroRef} className="relative flex min-h-[90vh] items-center overflow-hidden pt-10 sm:pt-14">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,hsl(212_92%_45%_/_0.1),transparent_60%),radial-gradient(ellipse_at_80%_70%,hsl(130_55%_42%_/_0.06),transparent_60%)]" />
      
      {/* Floating code snippet — top left (desktop only) */}
      <motion.div animate={floatingAnimation} className="absolute top-20 left-[10%] hidden lg:block opacity-20">
        <div className={`rounded-lg border p-3 font-mono text-xs ${snippetCardClasses}`}>
          <span className="text-primary">def</span> hello():<br/>
          &nbsp;&nbsp;<span className="text-streak-green">print</span>("🐍")
        </div>
      </motion.div>
      {/* Floating code snippet — bottom right (desktop only) */}
      <motion.div animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1.5 } }} className="absolute bottom-32 right-[8%] hidden lg:block opacity-20">
        <div className={`rounded-lg border p-3 font-mono text-xs ${snippetCardClasses}`}>
          <span className="text-python-yellow">for</span> i <span className="text-primary">in</span> range(∞):<br/>
          &nbsp;&nbsp;learn()
        </div>
      </motion.div>

      {/* Main hero content with parallax */}
      <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative isolate mx-auto w-full max-w-5xl px-4 py-24 text-center sm:px-6 md:py-32">
        <div className={`absolute inset-x-2 top-8 -bottom-2 -z-10 rounded-[2.75rem] blur-2xl sm:inset-x-6 sm:top-10 ${heroGlowClasses}`} />
        {/* "Free Python Learning Platform" badge */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <span className={`mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm backdrop-blur-sm ${heroBadgeClasses}`}>
            <Sparkles className="w-3.5 h-3.5" /> Free Python Learning Platform
          </span>
        </motion.div>
        
        {/* Main headline with gradient text */}
        <motion.h1
          className={`mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-7xl ${heroTitleClasses}`}
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
        >
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55, ease: "easeOut" }}
          >
            Master Python with
          </motion.span>{" "}
          <motion.span
            className={`relative inline-block px-2 pb-4 ${heroBrandClasses}`}
            initial={{ opacity: 0, y: 22, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              backgroundPosition: brandPulseAnimation.backgroundPosition,
            }}
            transition={{
              opacity: { delay: 0.28, duration: 0.7, ease: "easeOut" },
              y: { delay: 0.28, duration: 0.7, ease: "easeOut" },
              scale: { delay: 0.28, duration: 0.7, ease: "easeOut" },
              backgroundPosition: brandPulseAnimation.transition,
            }}
            style={{ backgroundSize: "220% 220%" }}
          >
            <span className={`pointer-events-none absolute inset-x-0 bottom-2 top-3 -z-10 rounded-[2rem] ${brandFrameClasses}`} />
            <span className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl ${brandGlowClasses}`} />
            PyMaster
            <motion.span
              className={`pointer-events-none absolute inset-x-5 bottom-1 h-[3px] rounded-full ${brandUnderlineClasses}`}
              initial={{ opacity: 0, scaleX: 0.68 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.36, duration: 0.6, ease: "easeOut" }}
            />
            <motion.span
              className="pointer-events-none absolute bottom-0 left-[12%] h-8 w-10 rounded-full bg-white/35 blur-md"
              animate={shimmerAnimation}
              transition={shimmerAnimation.transition}
              style={{ mixBlendMode: isDarkTheme ? "screen" : "soft-light" }}
            />
          </motion.span>
          <br />
          <motion.span
            className={`inline-block ${heroTaglineClasses}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.55, ease: "easeOut" }}
          >
            Build. Learn. Earn.
          </motion.span>
        </motion.h1>
        
        {/* Subtitle description */}
        <motion.p
          className={`mx-auto mb-10 max-w-2xl text-base leading-relaxed sm:text-lg md:text-xl ${heroSubtitleClasses}`}
          initial="hidden" animate="visible" variants={fadeUp} custom={2}
        >
          <span className={`font-semibold ${heroSubtitleBrandClasses}`}>PyMaster</span> — your free Python learning platform with crystal-clear lessons, 100+ coding challenges, 
          a built-in code editor, and a reward system that keeps you hooked.
        </motion.p>

        {/* Streak display — only shown if user has an active streak */}
        {progress.streak > 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2.5} className="flex justify-center mb-6">
            <div className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 backdrop-blur-sm ${streakCardClasses}`}>
              <StreakFire streak={progress.streak} size="md" showQuote />
              <span className="text-sm text-muted-foreground">day streak</span>
            </div>
          </motion.div>
        )}
        
        {/* CTA buttons — Start Learning + Browse Problems */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12"
          initial="hidden" animate="visible" variants={fadeUp} custom={3}
        >
          <Button asChild size="lg" className="gap-2 text-base h-12 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25">
            <Link to="/learn">
              <Rocket className="w-4 h-4" /> Start Learning Free <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 text-base h-12 px-8 border-border hover:bg-surface-2">
            <Link to="/problems">
              <Code className="w-4 h-4" /> Browse Problems
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className={`mx-auto mb-10 max-w-3xl rounded-2xl border p-4 backdrop-blur-sm ${guideCardClasses}`}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3.1}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-left">
              <div className={`text-xs font-semibold uppercase tracking-[0.16em] ${guideLabelClasses}`}>Instant Guide</div>
              <div className={`mt-1 text-sm font-semibold ${guideHeadingClasses}`}>Next 15 minutes: pick your goal</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedGuide("aptitude")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedGuide === "aptitude" ? "border-emerald-500 bg-emerald-500 text-white" : choiceButtonClasses
                }`}
              >
                Aptitude
              </button>
              <button
                type="button"
                onClick={() => setSelectedGuide("coding")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedGuide === "coding" ? "border-sky-500 bg-sky-500 text-white" : choiceButtonClasses
                }`}
              >
                Coding
              </button>
              <button
                type="button"
                onClick={() => setSelectedGuide("both")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedGuide === "both" ? "border-amber-500 bg-amber-500 text-white" : choiceButtonClasses
                }`}
              >
                Both
              </button>
            </div>
          </div>

          {guide ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
              <div className="text-left">
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${guide.tone}`}>
                  <Brain className="h-3.5 w-3.5" />
                  {guide.title}
                </div>
                <div className={`mt-2 text-sm ${guideIdleTextClasses}`}>{guide.subtitle}</div>
                <div className="mt-3 grid gap-2">
                  {guide.steps.map((step) => (
                    <div key={step} className={`rounded-xl border px-3 py-2 text-sm ${guideStepClasses}`}>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 sm:justify-start">
                <Button
                  type="button"
                  size="lg"
                  className="h-11 px-6 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
                  onClick={() => navigate(guide.startTo)}
                >
                  Start Now <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-11 px-6 border-border hover:bg-surface-2"
                  onClick={() => setSelectedGuide(null)}
                >
                  Reset
                </Button>
              </div>
            </div>
          ) : (
            <div className={`mt-3 text-left text-sm ${guideIdleTextClasses}`}>
              After you pick a goal, the page shows a quick checklist and a single start button.
            </div>
          )}
        </motion.div>

        <motion.div
          className="mb-10 flex justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3.2}
        >
          <div className="w-full flex justify-center">
            <AddToHomeScreenButton />
          </div>
        </motion.div>

        {/* Stats grid — shows platform numbers */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
          initial="hidden" animate="visible" variants={fadeUp} custom={4}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className={`rounded-xl border p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 sm:p-4 ${statCardClasses}`}
              whileHover={{ scale: 1.05 }}
            >
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className={`text-xl font-bold sm:text-2xl ${statValueClasses}`}>{stat.value}</div>
              <div className={`text-[10px] sm:text-xs ${statLabelClasses}`}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll down indicator — bouncing arrow at the bottom */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className={`text-xs ${scrollHintClasses}`}>Scroll down</span>
        <ChevronDown className="w-7 h-7 text-primary/70" />
      </motion.div>
    </section>
  );
}
