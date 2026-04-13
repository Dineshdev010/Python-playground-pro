// ============================================================
// CAREER LEARN PAGE — src/pages/CareerLearnPage.tsx
// Individual career track learning page (Data Science, Web Dev,
// AI/ML, etc.) with sequential lesson unlocking.
// ============================================================
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { careerTracks } from "@/data/careerLessons";
import { useProgress } from "@/contexts/ProgressContext";
import { ExerciseEditor } from "@/components/ExerciseEditor";
import { SqlExerciseEditor } from "@/components/SqlExerciseEditor";
import { GitTerminalEditor } from "@/components/GitTerminalEditor";
import Editor from "@monaco-editor/react";
import { SQL_PRACTICE_DB_NAME, SQL_PRACTICE_DB_SETUP_SQL, SQL_PRACTICE_DB_TABLES } from "@/data/sqlSampleData";
import { executeSql } from "@/lib/sqlRunner";
import { cancelActivePythonExecution, getPythonExecutionTimeoutMs } from "@/lib/piston";
import { BookOpen, CheckCircle2, ChevronRight, Lock, ArrowLeft, Terminal as TerminalIcon, Database, Play, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function buildLessonPattern(strokeHex: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'><g fill='none' stroke='${strokeHex}' stroke-width='1'><circle cx='30' cy='30' r='20'/><circle cx='190' cy='50' r='16'/><path d='M0 110h220M110 0v220'/><path d='M20 200L80 140L140 200'/></g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function getLessonWallpaper(trackId: string, lessonTitle?: string, category?: string) {
  const topic = `${trackId} ${lessonTitle ?? ""} ${category ?? ""}`.toLowerCase();

  if (topic.includes("cloud") || topic.includes("mlops") || topic.includes("deploy")) {
    return `linear-gradient(140deg, rgba(9, 22, 45, 0.92), rgba(37, 99, 235, 0.26)), ${buildLessonPattern("#60a5fa")}`;
  }
  if (topic.includes("sql") || topic.includes("database") || topic.includes("etl")) {
    return `linear-gradient(140deg, rgba(8, 24, 32, 0.92), rgba(8, 145, 178, 0.24)), ${buildLessonPattern("#22d3ee")}`;
  }
  if (topic.includes("linux") || topic.includes("bash") || topic.includes("terminal") || topic.includes("git")) {
    return `linear-gradient(140deg, rgba(8, 26, 16, 0.92), rgba(34, 197, 94, 0.24)), ${buildLessonPattern("#4ade80")}`;
  }
  if (topic.includes("ai") || topic.includes("ml") || topic.includes("neural") || topic.includes("nlp")) {
    return `linear-gradient(140deg, rgba(24, 14, 42, 0.92), rgba(147, 51, 234, 0.24)), ${buildLessonPattern("#c084fc")}`;
  }
  if (topic.includes("web") || topic.includes("api") || topic.includes("http") || topic.includes("auth")) {
    return `linear-gradient(140deg, rgba(13, 20, 40, 0.92), rgba(59, 130, 246, 0.24)), ${buildLessonPattern("#60a5fa")}`;
  }
  if (topic.includes("data") || topic.includes("pandas") || topic.includes("analysis")) {
    return `linear-gradient(140deg, rgba(16, 21, 35, 0.92), rgba(234, 179, 8, 0.2)), ${buildLessonPattern("#facc15")}`;
  }
  if (topic.includes("security") || topic.includes("cyber")) {
    return `linear-gradient(140deg, rgba(38, 12, 16, 0.92), rgba(239, 68, 68, 0.2)), ${buildLessonPattern("#f87171")}`;
  }
  return `linear-gradient(140deg, rgba(10, 18, 35, 0.92), rgba(99, 102, 241, 0.18)), ${buildLessonPattern("#475569")}`;
}

export default function CareerLearnPage() {
  const { trackId } = useParams<{ trackId: string }>();
  const track = careerTracks.find(t => t.id === trackId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sqlPlayground, setSqlPlayground] = useState("");
  const [sqlOutput, setSqlOutput] = useState("");
  const [isSqlRunning, setIsSqlRunning] = useState(false);
  const [showDataset, setShowDataset] = useState(false);
  const { progress, resetLesson } = useProgress();
  const timeoutSeconds = Math.round(getPythonExecutionTimeoutMs() / 1000);

  // Derive track type flags unconditionally (before any early return)
  const isSqlTrack = (track?.language ?? "python") === "sql" || track?.id === "sql";
  const isBashTrack = (track?.language ?? "python") === "bash" || track?.id === "git";

  const sqlCategories = useMemo(() => {
    if (!isSqlTrack || !track) return [];
    const set = new Set<string>();
    for (const lesson of track.lessons) {
      if (lesson.category) set.add(lesson.category);
    }
    return Array.from(set);
  }, [isSqlTrack, track]);

  const selectedLesson = track?.lessons.find(l => l.id === selectedId);
  const lessonWallpaper = useMemo(
    () => getLessonWallpaper(track?.id ?? "", selectedLesson?.title, selectedLesson?.category),
    [selectedLesson?.category, selectedLesson?.title, track?.id],
  );

  // Auto-open the first lesson so the page never feels empty on first visit.
  useEffect(() => {
    if (!track) return;
    if (selectedId) return;
    if (track.lessons.length === 0) return;

    setSelectedId(track.lessons[0].id);
  }, [selectedId, track]);

  useEffect(() => {
    if (!isSqlTrack) return;
    if (!selectedLesson) return;
    setSqlPlayground(selectedLesson.codeExample);
    setSqlOutput("");
    setIsSqlRunning(false);
  }, [isSqlTrack, selectedLesson?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!track) {
    return (
      <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Career track not found</p>
          <Button asChild variant="outline"><Link to="/">Go Home</Link></Button>
        </div>
      </div>
    );
  }

  const isLessonUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    const prevLesson = track.lessons[index - 1];
    return progress.completedExercises.includes(`${prevLesson.id}:beginner`);
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

  const runSqlPlayground = async () => {
    setIsSqlRunning(true);
    setSqlOutput(`Running SQL (up to ${timeoutSeconds}s)...`);
    const result = await executeSql(sqlPlayground);
    if (result.error && !result.output) {
      setSqlOutput(`Error:\n${result.error}`);
    } else {
      setSqlOutput(result.output || result.error);
    }
    setIsSqlRunning(false);
  };

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-surface-1 overflow-y-auto shrink-0 hidden md:block">
        <div className="p-4 border-b border-border">
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1 mb-2 -ml-2">
            <Link to="/"><ArrowLeft className="w-3 h-3" /> Home</Link>
          </Button>
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> {track.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">{track.description}</p>
        </div>
        <nav className="p-2">
          {track.lessons.map((lesson, i) => {
            const unlocked = isLessonUnlocked(i);
            const exercisesDone = getLessonProgress(lesson.id);
            const allDone = exercisesDone === 3;
            return (
              <button
                key={lesson.id}
                onClick={() => unlocked && setSelectedId(lesson.id)}
                disabled={!unlocked}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm flex items-center gap-2 transition-colors mb-0.5 ${
                  !unlocked ? "text-muted-foreground/40 cursor-not-allowed"
                    : selectedId === lesson.id ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {!unlocked ? <Lock className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                  : allDone ? <CheckCircle2 className="w-4 h-4 text-streak-green shrink-0" />
                  : <span className="w-4 h-4 rounded-full border border-border text-[10px] flex items-center justify-center shrink-0">{exercisesDone > 0 ? exercisesDone : i + 1}</span>
                }
                <span className="truncate flex-1">{lesson.title}</span>
                {unlocked && exercisesDone > 0 && !allDone && (
                  <span className="text-[10px] text-python-yellow">{exercisesDone}/3</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto relative">
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-500"
          style={{
            backgroundImage: lessonWallpaper,
            backgroundSize: "cover, 220px 220px",
            backgroundPosition: "center, center",
            opacity: 0.55,
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/25 to-background/70" />
        <div className="relative z-10">
        {selectedLesson ? (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8">
            {/* Mobile back button */}
            <button 
              onClick={() => setSelectedId(null)} 
              className="md:hidden flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Lessons
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {track.title}
              </span>
              {isSqlTrack && selectedLesson.category && (
                <span className="px-2 py-0.5 rounded-full bg-secondary/60 text-foreground border border-border">
                  {selectedLesson.category}
                </span>
              )}
              {getLessonProgress(selectedLesson.id) === 3 && (
                <span className="px-2 py-0.5 rounded-full bg-streak-green/10 text-streak-green border border-streak-green/20">
                  ✓ Complete
                </span>
              )}
            </div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{selectedLesson.title}</h1>
              {getLessonProgress(selectedLesson.id) > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-[10px] sm:text-xs gap-1.5 opacity-60 hover:opacity-100 shrink-0 hover:border-destructive/30 hover:text-destructive hover:bg-destructive/10" 
                  onClick={() => {
                    if (window.confirm("Reset progress for this lesson? You will need to complete these exercises again.")) {
                      resetLesson(selectedLesson.id);
                    }
                  }}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset Lesson</span>
                  <span className="sm:hidden">Reset</span>
                </Button>
              )}
            </div>
            <p className="text-muted-foreground mb-6">{selectedLesson.description}</p>

            {isSqlTrack && sqlCategories.length > 0 && (
              <div className="mb-6">
                <div className="text-xs text-muted-foreground mb-2">SQL lesson types</div>
                <div className="flex flex-wrap gap-2">
                  {sqlCategories.map((cat) => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={selectedLesson.category === cat ? "default" : "outline"}
                      className="h-7 text-xs"
                      onClick={() => {
                        const first = track.lessons.find((l) => l.category === cat);
                        if (!first) return;
                        const firstIndex = track.lessons.findIndex((l) => l.id === first.id);
                        if (firstIndex >= 0 && isLessonUnlocked(firstIndex)) {
                          setSelectedId(first.id);
                        }
                      }}
                    >
                      {cat}
                    </Button>
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
                <span className="text-xs text-muted-foreground font-mono">{isBashTrack ? "terminal" : isSqlTrack ? "example.sql" : "example.py"}</span>
                {isSqlTrack ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1"
                    onClick={() => {
                      setSqlPlayground(selectedLesson.codeExample);
                      setSqlOutput("");
                    }}
                  >
                    <TerminalIcon className="w-3 h-3" /> Load into SQL Editor
                  </Button>
                ) : isBashTrack ? null : (
                  <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1">
                    <Link to={`/compiler?code=${encodeURIComponent(selectedLesson.codeExample)}`}>
                      <TerminalIcon className="w-3 h-3" /> Try in Compiler
                    </Link>
                  </Button>
                )}
              </div>
	              <pre className="p-4 text-sm font-mono text-foreground overflow-x-auto leading-relaxed">
	                {selectedLesson.codeExample}
	              </pre>
	            </div>

	            {/* SQL Playground */}
	            {isSqlTrack && (
	              <div className="mb-8">
	                <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
	                  <div className="min-w-[14rem]">
	                    <h3 className="text-lg font-semibold text-foreground">SQL Editor</h3>
	                    <p className="text-xs text-muted-foreground">
	                      Dataset: <span className="font-mono text-foreground">{SQL_PRACTICE_DB_NAME}</span> ({SQL_PRACTICE_DB_TABLES.join(", ")})
	                    </p>
	                  </div>
	                  <div className="flex items-center gap-2 flex-wrap">
	                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setShowDataset(true)}>
	                      <Database className="w-3 h-3" /> View Example Data
	                    </Button>
	                    <Button
	                      size="sm"
	                      variant="ghost"
	                      className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
	                      onClick={() => {
	                        setSqlPlayground(selectedLesson.codeExample);
	                        setSqlOutput("");
	                      }}
	                    >
	                      <RotateCcw className="w-3 h-3" /> Reset
	                    </Button>
	                    {isSqlRunning ? (
	                      <Button size="sm" variant="destructive" className="h-7 text-xs gap-1" onClick={cancelActivePythonExecution}>
	                        <Square className="w-3 h-3" /> Stop
	                      </Button>
	                    ) : (
	                      <Button size="sm" className="h-7 text-xs gap-1" onClick={runSqlPlayground}>
	                        <Play className="w-3 h-3" /> Run SQL
	                      </Button>
	                    )}
	                  </div>
	                </div>

	                <div className="border border-border rounded-lg overflow-hidden bg-card">
	                  <div className="h-56">
	                    <Editor
	                      height="100%"
	                      language="sql"
	                      theme="vs-dark"
	                      value={sqlPlayground}
	                      onChange={(v) => setSqlPlayground(v || "")}
	                      options={{
	                        fontSize: 13,
	                        fontFamily: "'JetBrains Mono', monospace",
	                        minimap: { enabled: false },
	                        padding: { top: 12 },
	                        scrollBeyondLastLine: false,
	                        wordWrap: "on",
	                        lineNumbers: "on",
	                        automaticLayout: true,
	                      }}
	                    />
	                  </div>
	                  {sqlOutput && (
	                    <pre className="border-t border-border px-4 py-3 text-xs font-mono whitespace-pre-wrap text-foreground">
	                      {sqlOutput}
	                    </pre>
	                  )}
	                </div>

	                <Dialog open={showDataset} onOpenChange={setShowDataset}>
	                  <DialogContent className="max-w-3xl">
	                    <DialogHeader>
	                      <DialogTitle>Example Data (SQLite)</DialogTitle>
	                      <DialogDescription>
	                        This SQL script is loaded before every run so the editor always starts with the same data.
	                      </DialogDescription>
	                    </DialogHeader>
	                    <pre className="max-h-[60vh] overflow-auto rounded-lg border border-border bg-surface-1 p-3 text-xs font-mono whitespace-pre-wrap text-foreground">
	                      {SQL_PRACTICE_DB_SETUP_SQL}
	                    </pre>
	                  </DialogContent>
	                </Dialog>
	              </div>
	            )}
	
	            {/* Exercises */}
	            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Exercises
                <span className="text-sm font-normal text-muted-foreground ml-2">— Complete beginner to unlock next</span>
              </h3>
              <div className="space-y-3">
                {(["beginner", "intermediate", "advanced"] as const).map(level => (
                  isBashTrack ? (
                    <GitTerminalEditor
                      key={level}
                      exercise={selectedLesson.exercises[level]}
                      level={level}
                      lessonId={selectedLesson.id}
                      locked={!isExerciseUnlocked(selectedLesson.id, level)}
                    />
                  ) : isSqlTrack ? (
                    <SqlExerciseEditor
                      key={level}
                      exercise={selectedLesson.exercises[level]}
                      level={level}
                      lessonId={selectedLesson.id}
                      locked={!isExerciseUnlocked(selectedLesson.id, level)}
                    />
                  ) : (
                    <ExerciseEditor
                      key={level}
                      exercise={selectedLesson.exercises[level]}
                      level={level}
                      lessonId={selectedLesson.id}
                      locked={!isExerciseUnlocked(selectedLesson.id, level)}
                    />
                  )
                ))}
              </div>
            </div>

            {/* Next lesson */}
            {(() => {
              const ci = track.lessons.findIndex(l => l.id === selectedLesson.id);
              const next = ci < track.lessons.length - 1 ? track.lessons[ci + 1] : null;
              const canProceed = next && isLessonUnlocked(ci + 1);
              if (!next) return null;
              return (
                <div className={`p-4 rounded-lg border ${canProceed ? "border-primary/30 bg-primary/5" : "border-border bg-surface-1 opacity-60"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {canProceed ? <CheckCircle2 className="w-5 h-5 text-streak-green" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
                      <div>
                        <p className="text-sm font-medium text-foreground">{canProceed ? "Next Lesson Unlocked!" : "Complete beginner exercise to unlock"}</p>
                        <p className="text-xs text-muted-foreground">{next.title}</p>
                      </div>
                    </div>
                    <Button size="sm" disabled={!canProceed} onClick={() => setSelectedId(next.id)} className="gap-1">
                      Next <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">{track.title}</h2>
            <p className="text-muted-foreground mb-6">Select a lesson from the sidebar to start learning</p>
            {/* Mobile lesson list */}
            <div className="md:hidden w-full max-w-md space-y-2">
              {track.lessons.map((lesson, i) => {
                const unlocked = isLessonUnlocked(i);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => unlocked && setSelectedId(lesson.id)}
                    disabled={!unlocked}
                    className={`w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg transition-colors ${unlocked ? "hover:border-primary/40" : "opacity-40 cursor-not-allowed"}`}
                  >
                    <div className="flex items-center gap-3">
                      {unlocked ? <BookOpen className="w-4 h-4 text-primary" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                      <div className="text-left">
                        <div className="text-sm font-medium text-foreground">{lesson.title}</div>
                        <div className="text-xs text-muted-foreground">{lesson.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}


