// ============================================================
// HERO SECTION — src/components/landing/HeroSection.tsx
// The main hero banner at the top of the landing page.
// Features: animated headline, CTA buttons, platform stats,
// streak display, floating code snippets, parallax scroll effect.
// Also exports the `fadeUp` animation variant used by other sections.
// ============================================================

import { Link, useNavigate } from "react-router-dom";
import { motion, type Easing } from "framer-motion";
import { ArrowRight, BookOpen, Code, Flame, Target, Sparkles, Rocket, Brain, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useProgress } from "@/contexts/ProgressContext";
import { useMemo, useRef, useState } from "react";
import { useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
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
    : "bg-[radial-gradient(circle_at_50%_18%,rgba(248,250,252,0.92),rgba(248,250,252,0.72)_34%,rgba(248,250,252,0.28)_66%,transparent_100%)]";
  
  const heroBadgeClasses = isDarkTheme
    ? "border border-primary/40 bg-slate-950/60 text-sky-300 shadow-[0_8px_30px_rgba(2,6,23,0.58)]"
    : "border border-sky-400/30 bg-blue-50/80 text-sky-700 shadow-[0_10px_35px_rgba(59,130,246,0.15)]";

  const heroBrandLineClasses = isDarkTheme
    ? "text-slate-100 drop-shadow-[0_10px_30px_rgba(2,6,23,0.8)]"
    : "text-slate-900 drop-shadow-[0_5px_15px_rgba(59,130,246,0.12)]";

  // Massive visual impact for PyMaster box
  const heroBrandBoxClasses = isDarkTheme
    ? "bg-transparent transition-shadow duration-500 px-2 py-2"
    : "bg-transparent transition-shadow duration-500 px-2 py-2";

  const heroBrandTextClasses = isDarkTheme
    ? "bg-[linear-gradient(90deg,#7dd3fc_0%,#a78bfa_35%,#fde047_68%,#7dd3fc_100%)] bg-[length:220%_220%] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(125,211,252,0.3)]"
    : "bg-[linear-gradient(90deg,#2563eb_0%,#7c3aed_35%,#eab308_68%,#2563eb_100%)] bg-[length:220%_220%] bg-clip-text text-transparent drop-shadow-[0_4px_15px_rgba(37,99,235,0.2)]";

  // Make Tagline vibrant
  const heroTaglineClasses = isDarkTheme
    ? "bg-[linear-gradient(90deg,#fde68a,#fcd34d,#fbbf24)] bg-clip-text text-transparent drop-shadow-[0_6px_24px_rgba(250,204,21,0.28)]"
    : "text-blue-600 font-extrabold tracking-tight drop-shadow-[0_4px_12px_rgba(37,99,235,0.15)]";

  const heroSubtitleClasses = isDarkTheme
    ? "text-slate-300 drop-shadow-[0_4px_20px_rgba(2,6,23,0.6)]"
    : "text-slate-600 text-[1.1rem] drop-shadow-[0_2px_10px_rgba(255,255,255,0.55)]";
    
  const heroSubtitleBrandClasses = isDarkTheme ? "text-white" : "text-slate-900";
  
  const snippetCardClasses = isDarkTheme
    ? "bg-slate-950/40 border-white/10 text-slate-300 shadow-2xl backdrop-blur-md"
    : "bg-white/80 border-blue-100/50 text-slate-700 shadow-[0_20px_50px_rgba(59,130,246,0.12)] backdrop-blur-md";

  const streakCardClasses = isDarkTheme
    ? "bg-card/80 border-white/10 text-slate-300 shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
    : "bg-white/90 border-blue-200/50 text-slate-800 shadow-[0_15px_40px_rgba(37,99,235,0.12)]";

  const guideCardClasses = isDarkTheme
    ? "border-border/60 bg-card/60 shadow-[0_15px_50px_rgba(0,0,0,0.4)]"
    : "border-blue-100 bg-white/90 shadow-[0_20px_60px_rgba(59,130,246,0.1)]";

  const guideLabelClasses = isDarkTheme ? "text-muted-foreground" : "text-slate-500 font-bold";
  const guideHeadingClasses = isDarkTheme ? "text-foreground" : "text-slate-900";
  const guideIdleTextClasses = isDarkTheme ? "text-muted-foreground" : "text-slate-500";
  
  const guideStepClasses = isDarkTheme
    ? "border-border/60 bg-background/70 text-muted-foreground"
    : "border-blue-50/50 bg-blue-50/30 text-slate-700";

  const choiceButtonClasses = isDarkTheme
    ? "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-slate-800"
    : "border-blue-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-blue-50 hover:border-blue-300 shadow-sm";

  const statCardClasses = isDarkTheme
    ? "bg-card/50 border-border/50 hover:border-primary/50 hover:bg-card/80"
    : "bg-white/90 border-blue-100 shadow-[0_16px_40px_rgba(37,99,235,0.06)] hover:border-blue-400/40 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)]";

  const statLabelClasses = isDarkTheme ? "text-slate-400" : "text-slate-500 font-medium";
  const statValueClasses = isDarkTheme ? "text-white" : "text-slate-900";
  const scrollHintClasses = isDarkTheme ? "text-slate-400" : "text-blue-500 font-medium";

  // ---------- Mouse Parallax tracking ----------
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Normalize to -1 -> 1 range
    mouseX.set((clientX / innerWidth) * 2 - 1);
    mouseY.set((clientY / innerHeight) * 2 - 1);
  };

  const springConfig = { damping: 30, stiffness: 100, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Background blobs shift exactly opposite of mouse movement
  const bgBlobX = useTransform(smoothMouseX, [-1, 1], [40, -40]);
  const bgBlobY = useTransform(smoothMouseY, [-1, 1], [40, -40]);

  // Code snippets float with the mouse at different depths
  const snippet1X = useTransform(smoothMouseX, [-1, 1], [-25, 25]);
  const snippet1Y = useTransform(smoothMouseY, [-1, 1], [-15, 15]);

  const snippet2X = useTransform(smoothMouseX, [-1, 1], [20, -20]);
  const snippet2Y = useTransform(smoothMouseY, [-1, 1], [25, -25]);

  return (
    <section 
      ref={heroRef} 
      className="relative flex min-h-[90vh] items-center overflow-hidden pt-10 sm:pt-14"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      {/* Background gradient blobs (cooler for light mode, deep for dark mode) */}
      {isDarkTheme ? (
        <motion.div style={{ x: bgBlobX, y: bgBlobY }} className="absolute -inset-[100px] z-0 pointer-events-none bg-[radial-gradient(ellipse_at_20%_30%,hsl(212_92%_45%_/_0.15),transparent_60%),radial-gradient(ellipse_at_80%_70%,hsl(130_55%_42%_/_0.1),transparent_60%)]" />
      ) : (
        <motion.div style={{ x: bgBlobX, y: bgBlobY }} className="absolute -inset-[100px] z-0 pointer-events-none bg-[radial-gradient(ellipse_at_20%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(234,179,8,0.08),transparent_50%)]" />
      )}
      
      {/* Floating code snippet — top left (desktop only) */}
      <motion.div style={{ x: snippet1X, y: snippet1Y }} className={`absolute top-20 left-[10%] hidden lg:block ${isDarkTheme ? 'opacity-30' : 'opacity-80'} pointer-events-none`}>
        <motion.div animate={floatingAnimation}>
          <div className={`rounded-xl border font-mono text-sm overflow-hidden ${snippetCardClasses}`}>
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-inherit bg-black/5 dark:bg-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="p-4">
              <span className="text-primary font-bold">def</span> <span className={isDarkTheme ? "text-blue-300" : "text-blue-700"}>hello</span>():<br/>
              &nbsp;&nbsp;<span className="text-streak-green">print</span>(<span className={isDarkTheme ? "text-yellow-200" : "text-yellow-600"}>"🐍 Welcome"</span>)
            </div>
          </div>
        </motion.div>
      </motion.div>
      {/* Floating code snippet — bottom right (desktop only) */}
      <motion.div style={{ x: snippet2X, y: snippet2Y }} className={`absolute bottom-32 right-[8%] hidden lg:block ${isDarkTheme ? 'opacity-30' : 'opacity-80'} pointer-events-none`}>
        <motion.div animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1.5 } }}>
          <div className={`rounded-xl border font-mono text-sm overflow-hidden ${snippetCardClasses}`}>
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-inherit bg-black/5 dark:bg-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="p-4">
              <span className="text-python-yellow font-bold">for</span> i <span className="text-primary font-bold">in</span> range(∞):<br/>
              &nbsp;&nbsp;<span className={isDarkTheme ? "text-blue-300" : "text-blue-700"}>learn</span>()
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main hero content with parallax */}
      <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative isolate mx-auto w-full max-w-5xl px-4 py-24 text-center sm:px-6 md:py-32">
        <div className={`absolute inset-x-2 top-8 -bottom-2 -z-10 rounded-[3rem] blur-3xl sm:inset-x-6 sm:top-10 ${heroGlowClasses}`} />
        
        {/* "Free Python Learning Platform" badge */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <span className={`inline-flex items-center gap-2 mb-8 rounded-full px-5 py-2 text-sm font-semibold backdrop-blur-md ${heroBadgeClasses}`}>
            <Sparkles className={`w-4 h-4 ${isDarkTheme ? 'text-yellow-300' : 'text-blue-600'}`} /> Free Python Learning Platform
          </span>
        </motion.div>
        
        {/* Main headline with distinct Typography */}
        <motion.h1
          className={`mb-6 text-5xl font-black leading-[1.15] tracking-tight sm:text-6xl md:text-[5rem] ${heroBrandLineClasses}`}
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
        >
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55, ease: "easeOut" }}
          >
            Master Python with
          </motion.span>{" "}
          <br className="hidden sm:block" />
          
          <motion.span
            className={`relative inline-block mt-3 mb-2 mx-1 ${heroBrandBoxClasses} cursor-default`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.28, duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }} // Interactive pop on hover
          >
            <motion.span
              className={`inline-block ${heroBrandTextClasses}`}
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                filter: isDarkTheme 
                  ? ["drop-shadow(0 0 20px rgba(125,211,252,0.3))", "drop-shadow(0 0 60px rgba(167,139,250,0.7))", "drop-shadow(0 0 20px rgba(125,211,252,0.3))"]
                  : ["drop-shadow(0 8px 15px rgba(37,99,235,0.2))", "drop-shadow(0 15px 30px rgba(124,58,237,0.45))", "drop-shadow(0 8px 15px rgba(37,99,235,0.2))"]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundSize: "220% 220%" }}
            >
              PyMaster
            </motion.span>
          </motion.span>
          
          <br />
          <motion.span
            className={`inline-block mt-4 text-[0.85em] ${heroTaglineClasses}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.55, ease: "easeOut" }}
          >
            Build. Learn. Earn.
          </motion.span>
        </motion.h1>
        
        {/* Subtitle description */}
        <motion.p
          className={`mx-auto mb-10 max-w-2xl text-base leading-relaxed sm:text-xl font-medium ${heroSubtitleClasses}`}
          initial="hidden" animate="visible" variants={fadeUp} custom={2}
        >
          <span className={`font-bold ${heroSubtitleBrandClasses}`}>PyMaster</span> — your free Python learning platform with crystal-clear lessons, 100+ coding challenges, 
          a built-in code editor, and a reward system that keeps you hooked.
        </motion.p>

        {/* Streak display — only shown if user has an active streak */}
        {progress.streak > 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2.5} className="flex justify-center mb-6">
            <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-sm ${streakCardClasses}`}>
              <StreakFire streak={progress.streak} />
              <span className="text-sm font-bold tracking-wide">{progress.streak} <span className="opacity-70 font-medium">Day Streak!</span></span>
            </div>
          </motion.div>
        )}
        
        {/* Social Proof Cluster */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2.8} className="flex flex-col items-center justify-center gap-3 mb-6">
          <div className="flex -space-x-3">
             <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="User" className="w-10 h-10 rounded-full border-2 border-background object-cover shadow-sm" />
             <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="User" className="w-10 h-10 rounded-full border-2 border-background object-cover shadow-sm" />
             <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64" alt="User" className="w-10 h-10 rounded-full border-2 border-background object-cover shadow-sm" />
             <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64" alt="User" className="w-10 h-10 rounded-full border-2 border-background object-cover shadow-sm" />
             <div className={`flex w-10 h-10 items-center justify-center rounded-full border-2 border-background text-[11px] font-bold shadow-sm ${isDarkTheme ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'}`}>
               10k+
             </div>
          </div>
          <div className={`text-sm font-medium flex items-center gap-1.5 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
            <div className="flex gap-0.5 text-amber-400">
               {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
            </div>
            <span>Trusted by developers worldwide</span>
          </div>
        </motion.div>

        {/* CTA buttons — Start Learning + Browse Problems */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 relative z-10"
          initial="hidden" animate="visible" variants={fadeUp} custom={3}
        >
          <div className="relative group">
            <motion.div 
               className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 opacity-60 blur-[10px] transition duration-1000 group-hover:opacity-100 group-hover:duration-200"
               animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <Button asChild size="lg" className="relative gap-2 text-base h-12 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-lg shadow-primary/25">
              <Link to="/learn">
                <Rocket className="w-4 h-4" /> Start Learning Free <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <Button asChild variant="outline" size="lg" className="gap-2 text-base h-12 px-8 border-border hover:bg-surface-2 bg-background/50 backdrop-blur-sm">
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
