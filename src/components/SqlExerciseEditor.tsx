import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import confetti from "canvas-confetti";
import { Exercise } from "@/data/lessons";
import { useProgress } from "@/contexts/ProgressContext";
import { cancelActivePythonExecution, getPythonExecutionTimeoutMs } from "@/lib/piston";
import { executeSql } from "@/lib/sqlRunner";
import { Button } from "@/components/ui/button";
import { AdViewModal } from "@/components/AdViewModal";
import { SPONSOR_DESTINATIONS } from "@/data/ads";
import { Play, CheckCircle2, ChevronDown, ChevronUp, Lock, RotateCcw, Lightbulb, Eye, Tv, Square } from "lucide-react";

interface SqlExerciseEditorProps {
  exercise: Exercise;
  level: "beginner" | "intermediate" | "advanced";
  lessonId: string;
  locked?: boolean;
}

function generateHint(exercise: Exercise): string {
  const expected = exercise.expectedOutput;
  if (expected.includes("\n")) {
    return `Your result has ${expected.split("\n").length} lines. First line: "${expected.split("\n")[0]}"`;
  }
  return `Expected output starts with: "${expected.substring(0, 40)}${expected.length > 40 ? "..." : ""}"`;
}

function stripSqlCommentsAndWhitespace(sql: string): string {
  return sql
    .split("\n")
    .map((line) => line.replace(/--.*$/g, ""))
    .join("\n")
    .trim();
}

export function SqlExerciseEditor({ exercise, level, lessonId, locked }: SqlExerciseEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sql, setSql] = useState(exercise.starterCode);
  const [output, setOutput] = useState("");
  const [passed, setPassed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [unlockedByAd, setUnlockedByAd] = useState(false);
  const { progress, completeExercise } = useProgress();
  const timeoutSeconds = Math.round(getPythonExecutionTimeoutMs() / 1000);

  const exerciseKey = `${lessonId}:${level}`;
  const alreadyCompleted = progress.completedExercises.includes(exerciseKey);

  useEffect(() => {
    setIsOpen(false);
    setSql(exercise.starterCode);
    setOutput("");
    setPassed(false);
    setIsRunning(false);
    setShowHint(false);
    setShowSolution(false);
    setUnlockedByAd(false);
    setShowAdModal(false);
  }, [exerciseKey, exercise.starterCode]);

  const levelColors = useMemo(
    () => ({
      beginner: "bg-streak-green/10 border-streak-green/30 text-streak-green",
      intermediate: "bg-python-yellow/10 border-python-yellow/30 text-python-yellow",
      advanced: "bg-destructive/10 border-destructive/30 text-destructive",
    }),
    [],
  );

  const runAndCheck = async () => {
    const userSql = sql.trim();
    if (!stripSqlCommentsAndWhitespace(userSql)) {
      setOutput("Write a SQL query first, then click Run.");
      setPassed(false);
      return;
    }

    setIsRunning(true);
    setOutput(`Running SQL (up to ${timeoutSeconds}s)...`);

    const result = await executeSql(userSql);
    const actualOutput = result.output.trim();
    const expected = exercise.expectedOutput.trim();

    if (result.error && !result.output) {
      setOutput(`Error:\n${result.error}`);
      setPassed(false);
      setIsRunning(false);
      return;
    }

    if (actualOutput === expected) {
      setOutput(`Output:\n${actualOutput}\n\nCorrect! Exercise completed!`);
      setPassed(true);
      if (!alreadyCompleted) {
        completeExercise(exerciseKey);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#3b82f6", "#22c55e", "#eab308"],
        });
      }
    } else {
      setOutput(`Your output:\n${actualOutput || "(no output)"}\n\nExpected:\n${expected}\n\nNot quite right. Check your query.`);
      setPassed(false);
    }

    setIsRunning(false);
  };

  if (locked && !unlockedByAd) {
    return (
      <>
        <div className="bg-surface-1 border border-border rounded-lg p-4 opacity-70">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${levelColors[level]}`}>{level}</span>
              <span className="text-sm text-muted-foreground">Complete the previous exercise to unlock</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => setShowAdModal(true)}
            >
              <Tv className="w-3 h-3" /> View Sponsor Message
            </Button>
          </div>
        </div>
        <AdViewModal
          isOpen={showAdModal}
          onClose={() => setShowAdModal(false)}
          onComplete={() => setUnlockedByAd(true)}
          sponsorLink={SPONSOR_DESTINATIONS.exerciseUnlock}
          completionTitle="Exercise unlocked"
          completionDescription="Thanks for viewing the sponsor message."
        />
      </>
    );
  }

  const hint = exercise.hint || generateHint(exercise);
  const solution = exercise.solution || "";

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all ${
        alreadyCompleted ? "border-streak-green/30 bg-streak-green/5" : "border-border bg-card"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-1/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {alreadyCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-streak-green" />
          ) : (
            <div className="w-4 h-4 rounded-full border border-border" />
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${levelColors[level]}`}>{level}</span>
          <span className="text-sm text-foreground">{exercise.prompt}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {isOpen && (
        <div className="border-t border-border">
          <div className="h-48">
            <Editor
              height="100%"
              language="sql"
              theme="vs-dark"
              value={sql}
              onChange={(v) => setSql(v || "")}
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

          {(showHint || showSolution) && (
            <div className="border-t border-border bg-muted/30 px-4 py-3 space-y-2">
              {showHint && !showSolution && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-python-yellow">Hint:</span>{" "}
                  {hint}
                </div>
              )}
              {showSolution && solution && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-1 border-t border-border/50 first:border-0 first:pt-0">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary/90 uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Solution SQL
                    </div>
                    <pre className="text-xs font-mono bg-background/50 border border-primary/20 rounded-md p-3 text-foreground whitespace-pre-wrap shadow-sm">
                      {solution}
                    </pre>
                  </div>
                  <div className="space-y-1.5 pt-1 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs font-semibold text-streak-green/90 uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-streak-green" />
                      Expected Output
                    </div>
                    <pre className="text-xs font-mono bg-streak-green/5 border border-streak-green/20 rounded-md p-3 text-streak-green whitespace-pre-wrap shadow-sm">
                      {exercise.expectedOutput}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-border">
            <div className="flex items-center justify-between px-4 py-2 bg-surface-1 gap-2 flex-wrap">
              <div className="text-xs text-muted-foreground font-mono">
                Expected:{" "}
                <span className="text-foreground">
                  {exercise.expectedOutput.split("\n")[0]}
                  {exercise.expectedOutput.includes("\n") ? "..." : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs gap-1 text-python-yellow/70 hover:text-python-yellow"
                  onClick={() => {
                    setShowHint(!showHint);
                    setShowSolution(false);
                  }}
                >
                  <Lightbulb className="w-3 h-3" /> {showHint ? "Hide Hint" : "Hint"}
                </Button>
                {exercise.solution && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs gap-1 text-primary/70 hover:text-primary"
                    onClick={() => {
                      setShowSolution(!showSolution);
                      setShowHint(false);
                    }}
                  >
                    <Eye className="w-3 h-3" /> {showSolution ? "Hide Solution" : "Solution"}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSql(exercise.starterCode);
                    setOutput("");
                    setPassed(false);
                  }}
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </Button>
                {isRunning ? (
                  <Button size="sm" variant="destructive" className="h-7 text-xs gap-1" onClick={cancelActivePythonExecution}>
                    <Square className="w-3 h-3" /> Stop
                  </Button>
                ) : (
                  <Button size="sm" className="h-7 text-xs gap-1" onClick={runAndCheck}>
                    <Play className="w-3 h-3" /> Run & Check
                  </Button>
                )}
              </div>
            </div>
            {output && (
              <pre className={`px-4 py-3 text-xs font-mono whitespace-pre-wrap ${passed ? "text-streak-green" : "text-foreground"}`}>
                {output}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

