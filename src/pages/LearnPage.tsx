// ============================================================
// LEARN PAGE — src/pages/LearnPage.tsx
// Interactive Python lesson viewer with categorized lessons,
// exercise editor, ad-to-unlock, and progress tracking.
// ============================================================
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { lessons } from "@/data/lessons";
import { useProgress } from "@/contexts/ProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import { ExerciseEditor } from "@/components/ExerciseEditor";
import { AdViewModal } from "@/components/AdViewModal";
import { BookOpen, CheckCircle2, ChevronRight, Terminal, Lock, Play, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GoogleAd } from "@/components/ads/GoogleAd";
import { Helmet } from "react-helmet-async";

const categoryOrder = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

const categoryTone: Record<(typeof categoryOrder)[number], { label: string; heading: string; badge: string }> = {
  Beginner: {
    label: "text-streak-green",
    heading: "🟢 Beginner",
    badge: "bg-streak-green/10 text-streak-green border-streak-green/20",
  },
  Intermediate: {
    label: "text-primary",
    heading: "🔵 Intermediate",
    badge: "bg-primary/10 text-primary border-primary/20",
  },
  Advanced: {
    label: "text-expert-purple",
    heading: "🟣 Advanced",
    badge: "bg-expert-purple/10 text-expert-purple border-expert-purple/20",
  },
  Expert: {
    label: "text-reward-gold",
    heading: "🟡 Expert",
    badge: "bg-reward-gold/10 text-reward-gold border-reward-gold/20",
  },
};

const topicCoverage = [
  {
    title: "Core Python",
    items: ["Syntax", "variables", "data types", "strings", "input/output", "numbers", "control flow", "loops"],
  },
  {
    title: "Collections",
    items: ["Lists", "tuples", "sets", "dictionaries", "comprehensions", "sorting", "itertools", "functional tools"],
  },
  {
    title: "Functions To OOP",
    items: ["Functions", "recursion", "modules", "imports", "classes", "inheritance", "decorators", "context managers"],
  },
  {
    title: "Real-World Python",
    items: ["Files", "exceptions", "regex", "testing", "debugging", "APIs", "web scraping", "concurrency"],
  },
];

const beginnerMastery = [
  "Read and write basic Python syntax confidently",
  "Use variables, data types, strings, and numbers correctly",
  "Make decisions with if, elif, else, and boolean logic",
  "Repeat work with for loops, while loops, and range()",
  "Work with lists, tuples, sets, and dictionaries",
  "Write simple reusable functions with parameters and return values",
  "Handle input, formatted output, and common beginner mistakes",
  "Read small programs and explain what each line is doing",
];

function getLessonHeadings(content: string) {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## ") || line.startsWith("### "))
    .map((line) => line.replace(/^###?\s+/, ""))
    .slice(0, 5);
}

export default function LearnPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { progress, completeLesson, unlockLesson } = useProgress();
  const { user } = useAuth();
  const navigate = useNavigate();
  const categories = categoryOrder.filter((category) => lessons.some((lesson) => lesson.category === category));

  const selectedLesson = lessons.find(l => l.id === selectedId);

  // A lesson is unlocked if:
  // - It's the first one
  // - All 3 exercises of the previous lesson are completed
  // - User paid $100 to unlock it
  const isLessonUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    const lesson = lessons[index];
    if (progress.unlockedLessons.includes(lesson.id)) return true;
    const prevLesson = lessons[index - 1];
    const levels = ["beginner", "intermediate", "advanced"];
    return levels.every(l => progress.completedExercises.includes(`${prevLesson.id}:${l}`));
  };

  const isExerciseUnlocked = (lessonId: string, level: "beginner" | "intermediate" | "advanced"): boolean => {
    if (level === "beginner") return true;
    if (level === "intermediate") return progress.completedExercises.includes(`${lessonId}:beginner`);
    if (level === "advanced") return progress.completedExercises.includes(`${lessonId}:intermediate`);
    return false;
  };

  const getLessonProgress = (lessonId: string) => {
    const levels = ["beginner", "intermediate", "advanced"] as const;
    return levels.filter(l => progress.completedExercises.includes(`${lessonId}:${l}`)).length;
  };

  const [showAdForLesson, setShowAdForLesson] = useState<string | null>(null);

  const handleAdUnlock = (lessonId: string) => {
    setShowAdForLesson(lessonId);
  };

  const handleAdComplete = () => {
    if (showAdForLesson) {
      unlockLesson(showAdForLesson, 0);
      toast.success("Chapter unlocked! 🔓", { description: "Thanks for viewing the sponsor message." });
      setSelectedId(showAdForLesson);
      setShowAdForLesson(null);
    }
  };

  const handleWalletUnlock = (lessonId: string) => {
    const unlocked = unlockLesson(lessonId);
    if (!unlocked) {
      toast.error("Not enough cash", { description: "You need $100 in your wallet to unlock this lesson instantly." });
      return;
    }

    toast.success("Chapter unlocked! 🔓", { description: "You spent $100 to unlock this lesson." });
    setSelectedId(lessonId);
  };

  const handleSelectLesson = (lessonId: string, index: number, unlocked: boolean) => {
    if (index > 0 && !user) {
      toast.info("Sign in required", { description: "Create an account to continue learning beyond Lesson 1." });
      navigate("/auth");
      return;
    }
    if (unlocked) {
      setSelectedId(lessonId);
    } else {
      handleAdUnlock(lessonId);
    }
  };

  const getLessonsByCategory = (cat: string) => lessons.filter(l => l.category === cat);
  const selectedLessonHeadings = selectedLesson ? getLessonHeadings(selectedLesson.content) : [];

  useEffect(() => {
    if (!selectedLesson) return;
    const levels = ["beginner", "intermediate", "advanced"] as const;
    const lessonFullyCompleted = levels.every((level) => progress.completedExercises.includes(`${selectedLesson.id}:${level}`));
    if (lessonFullyCompleted) {
      completeLesson(selectedLesson.id);
    }
  }, [completeLesson, progress.completedExercises, selectedLesson]);

  return (
    <>
    <Helmet>
      <title>Learn Python | Structured Lessons on PyMaster</title>
      <meta
        name="description"
        content="Study Python step by step with beginner, intermediate, and advanced lessons, code examples, and hands-on exercises."
      />
    </Helmet>
    <AdViewModal
      isOpen={!!showAdForLesson}
      onClose={() => setShowAdForLesson(null)}
      onComplete={handleAdComplete}
      completionTitle="Lesson unlocked"
      completionDescription="Thanks for viewing the sponsor message."
    />
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col md:h-[calc(100vh-3.5rem)] md:flex-row">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-surface-1 overflow-y-auto shrink-0 hidden md:block">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> Python Lessons
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {progress.completedLessons.length}/{lessons.length} completed
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Play className="w-3 h-3" /> View a sponsor message or pay $100 to unlock lessons
          </p>
        </div>
        <nav className="p-2">
          {categories.map(cat => {
            const catLessons = getLessonsByCategory(cat);
            return (
              <div key={cat} className="mb-3">
                <div className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${categoryTone[cat].label}`}>
                  {categoryTone[cat].heading}
                </div>
                {catLessons.map((lesson) => {
                  const globalIndex = lessons.indexOf(lesson);
                  const unlocked = isLessonUnlocked(globalIndex);
                  const exercisesDone = getLessonProgress(lesson.id);
                  const allDone = exercisesDone === 3;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson.id, globalIndex, unlocked)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors mb-0.5 ${
                        !unlocked
                          ? "text-muted-foreground/60 hover:bg-surface-2 cursor-pointer"
                          : selectedId === lesson.id
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {!unlocked ? (
                          <Lock className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                        ) : allDone ? (
                          <CheckCircle2 className="w-4 h-4 text-streak-green shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-border text-[10px] flex items-center justify-center shrink-0">
                            {globalIndex + 1}
                          </span>
                        )}
                        <span className="truncate flex-1">{lesson.title}</span>
                        {!unlocked && (
                          <span className="text-[10px] text-primary flex items-center gap-0.5"><Play className="w-3 h-3" />Sponsor / $100</span>
                        )}
                      </div>
                      {/* Progress bar for unlocked lessons */}
                      {unlocked && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                allDone ? "bg-streak-green" : exercisesDone > 0 ? "bg-python-yellow" : "bg-muted-foreground/20"
                              }`}
                              style={{ width: `${(exercisesDone / 3) * 100}%` }}
                            />
                          </div>
                          <span className={`text-[10px] tabular-nums ${
                            allDone ? "text-streak-green" : exercisesDone > 0 ? "text-python-yellow" : "text-muted-foreground"
                          }`}>
                            {exercisesDone}/3
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedLesson ? (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8">
            {/* Mobile back button */}
            <button 
              onClick={() => setSelectedId(null)} 
              className="md:hidden flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Lessons
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full border ${categoryTone[selectedLesson.category as keyof typeof categoryTone]?.badge ?? "bg-secondary text-foreground border-border"}`}>
                {selectedLesson.category}
              </span>
              {getLessonProgress(selectedLesson.id) === 3 && (
                <span className="px-2 py-0.5 rounded-full bg-streak-green/10 text-streak-green border border-streak-green/20">
                  ✓ All exercises complete
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{selectedLesson.title}</h1>
            <p className="text-muted-foreground mb-6">{selectedLesson.description}</p>

            {selectedLessonHeadings.length > 0 && (
              <div className="mb-6 rounded-2xl border border-border bg-card/60 p-4">
                <div className="text-sm font-semibold text-foreground mb-3">In This Lesson</div>
                <div className="flex flex-wrap gap-2">
                  {selectedLessonHeadings.map((heading) => (
                    <span key={heading} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                      {heading}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="mb-8">
              {selectedLesson.content.split("\n").map((line, i) => {
                if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">{line.replace("### ", "")}</h3>;
                if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-3">{line.replace("## ", "")}</h2>;
                if (line.startsWith("- ")) return <li key={i} className="text-muted-foreground ml-4 list-disc">{line.replace("- ", "")}</li>;
                if (line.trim() === "") return <br key={i} />;
                return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
              })}
            </div>

            {/* Code Example */}
            <div className="code-block mb-8">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="text-xs text-muted-foreground font-mono">example.py</span>
                <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <Link to={`/compiler?code=${encodeURIComponent(selectedLesson.codeExample)}`}>
                    <Terminal className="w-3 h-3" /> Try in Compiler
                  </Link>
                </Button>
              </div>
              <pre className="p-4 text-sm font-mono text-foreground overflow-x-auto leading-relaxed">
                {selectedLesson.codeExample}
              </pre>
            </div>

            <GoogleAd
              slot={import.meta.env.VITE_ADSENSE_SLOT_LEARN}
              label="Sponsored Resource"
              className="mb-8"
              minHeight={160}
            />

            {/* Exercises */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                 Exercises
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  — Complete all 3 to unlock next chapter
                </span>
              </h3>
              <div className="space-y-3">
                {(["beginner", "intermediate", "advanced"] as const).map(level => (
                  <ExerciseEditor
                    key={level}
                    exercise={selectedLesson.exercises[level]}
                    level={level}
                    lessonId={selectedLesson.id}
                    locked={!isExerciseUnlocked(selectedLesson.id, level)}
                  />
                ))}
              </div>
            </div>

            {/* Next chapter button */}
            {(() => {
              const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
              const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
              const canProceed = nextLesson && isLessonUnlocked(currentIndex + 1);
              
              if (!nextLesson) return null;
              
              return (
                <div className={`p-4 rounded-lg border ${canProceed ? "border-primary/30 bg-primary/5" : "border-border bg-surface-1"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {canProceed ? (
                        <CheckCircle2 className="w-5 h-5 text-streak-green" />
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {canProceed ? "Next Chapter Unlocked!" : "Locked — complete all 3 exercises, watch an ad, or pay $100"}
                        </p>
                        <p className="text-xs text-muted-foreground">{nextLesson.title}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!canProceed && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAdUnlock(nextLesson.id)}
                            className="gap-1 text-primary border-primary/30 hover:bg-primary/10"
                          >
                            <Play className="w-3 h-3" /> Sponsor Message
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWalletUnlock(nextLesson.id)}
                            className="gap-1 text-reward-gold border-reward-gold/30 hover:bg-reward-gold/10"
                          >
                            Pay $100
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        disabled={!canProceed}
                        onClick={() => setSelectedId(nextLesson.id)}
                        className="gap-1"
                      >
                        Next <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="flex flex-col items-center md:justify-center h-full text-center px-4 sm:px-6 py-6 overflow-y-auto">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-4 hidden md:block" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Select a Lesson</h2>
            <p className="text-muted-foreground mb-6 hidden md:block">Choose a topic from the sidebar to start learning with a broader, clearer Python track.</p>

            <div className="w-full max-w-5xl mb-8 grid gap-4 sm:grid-cols-2 text-left">
              {topicCoverage.map((group) => (
                <div key={group.title} className="rounded-2xl border border-border bg-card/60 p-4">
                  <div className="text-sm font-semibold text-foreground mb-3">{group.title}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full max-w-5xl mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-left">
              <div className="text-base font-semibold text-foreground mb-3">Beginner Mastery On PyMaster</div>
              <p className="text-sm text-muted-foreground mb-4">
                If someone completes the beginner track carefully, these are the core skills they should understand clearly before moving ahead.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {beginnerMastery.map((item) => (
                  <div key={item} className="rounded-xl border border-border bg-background/80 px-3 py-2 text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile lesson list grouped by category */}
            <div className="md:hidden w-full max-w-md space-y-4 text-left">
              {categories.map(cat => (
                <div key={cat}>
                  <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${categoryTone[cat].label}`}>
                    {categoryTone[cat].heading}
                  </h3>
                  <div className="space-y-2">
                    {getLessonsByCategory(cat).map(lesson => {
                      const globalIndex = lessons.indexOf(lesson);
                      const unlocked = isLessonUnlocked(globalIndex);
                      const exercisesDone = getLessonProgress(lesson.id);
                      const allDone = exercisesDone === 3;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(lesson.id, globalIndex, unlocked)}
                          className={`w-full px-4 py-3 bg-card border border-border rounded-lg transition-colors ${
                            unlocked ? "hover:border-primary/40" : "hover:border-reward-gold/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {!unlocked ? (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              ) : allDone ? (
                                <CheckCircle2 className="w-4 h-4 text-streak-green" />
                              ) : (
                                <BookOpen className="w-4 h-4 text-primary" />
                              )}
                              <div className="text-left">
                                <div className="text-sm font-medium text-foreground">{lesson.title}</div>
                                <div className="text-xs text-muted-foreground">{lesson.category}</div>
                              </div>
                            </div>
                            {!unlocked ? (
                              <span className="text-xs text-primary flex items-center gap-1"><Play className="w-3 h-3" />Sponsor / $100</span>
                            ) : (
                              <span className={`text-xs ${allDone ? "text-streak-green" : "text-muted-foreground"}`}>{exercisesDone}/3</span>
                            )}
                          </div>
                          {unlocked && (
                            <div className="mt-2 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${
                                  allDone ? "bg-streak-green" : exercisesDone > 0 ? "bg-python-yellow" : "bg-muted-foreground/20"
                                }`}
                                style={{ width: `${(exercisesDone / 3) * 100}%` }}
                              />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
