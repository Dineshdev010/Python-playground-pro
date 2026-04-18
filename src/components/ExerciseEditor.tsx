import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import confetti from "canvas-confetti";
import { Exercise } from "@/data/lessons";
import { useProgress } from "@/contexts/ProgressContext";
import { cancelActivePythonExecution, executePython, getPythonExecutionTimeoutMs } from "@/lib/piston";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Play, CheckCircle2, ChevronDown, ChevronUp, Lock, RotateCcw, Lightbulb, Eye, Square } from "lucide-react";

interface ExerciseEditorProps {
  exercise: Exercise;
  level: "beginner" | "intermediate" | "advanced";
  lessonId: string;
  locked?: boolean;
}

function generateHint(exercise: Exercise): string {
  const expected = exercise.expectedOutput;
  if (expected.includes("(") || expected.includes("[") || expected.includes("{")) {
    return `💡 Your output should use a data structure. Expected format starts with: "${expected.substring(0, 30)}..."`;
  }
  if (expected.includes("\n")) {
    return `💡 The output has ${expected.split("\n").length} lines. First line: "${expected.split("\n")[0]}"`;
  }
  return `💡 The expected output is: "${expected.length > 50 ? expected.substring(0, 50) + "..." : expected}"`;
}

function generateSolution(exercise: Exercise): string {
  // Derive a likely solution from the starter code and expected output
  const starter = exercise.starterCode;
  const expected = exercise.expectedOutput;
  
  // If there's an explicit solution, use it
  if (exercise.solution) return exercise.solution;
  
  // Simple heuristic: add a print statement for the expected output
  if (starter.includes("# Print") || starter.includes("# print")) {
    return `${starter.trimEnd()}\nprint(${JSON.stringify(expected).includes("\\n") ? "..." : `"${expected}"`})`;
  }
  
  return `# Solution: Your code should produce:\n# ${expected.replace(/\n/g, "\n# ")}`;
}

export function ExerciseEditor({ exercise, level, lessonId, locked }: ExerciseEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState(exercise.starterCode);
  const [output, setOutput] = useState("");
  const [passed, setPassed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const { progress, completeExercise, addWallet, unlockSolution } = useProgress();
  const timeoutSeconds = Math.round(getPythonExecutionTimeoutMs() / 1000);

  const exerciseKey = `${lessonId}:${level}`;
  const alreadyCompleted = progress.completedExercises.includes(exerciseKey);
  const solutionUnlocked = progress.unlockedSolutions.includes(exerciseKey);

  useEffect(() => {
    setIsOpen(false);
    setCode(exercise.starterCode);
    setOutput("");
    setPassed(false);
    setIsRunning(false);
    setShowHint(false);
    setShowSolution(false);
  }, [exerciseKey, exercise.starterCode]);

  const levelColors = {
    beginner: "bg-streak-green/10 border-streak-green/30 text-streak-green",
    intermediate: "bg-python-yellow/10 border-python-yellow/30 text-python-yellow",
    advanced: "bg-destructive/10 border-destructive/30 text-destructive",
  };

  const runAndCheck = async () => {
    const userCode = code.trim();
    const starterCode = exercise.starterCode.trim();
    const hasNewCode = userCode.length > starterCode.length + 3;

    if (!hasNewCode) {
      setOutput("⚠️ Write your code first, then click Run.");
      setPassed(false);
      return;
    }

    setIsRunning(true);
    setOutput(`⏳ Running in browser worker (up to ${timeoutSeconds}s)...`);

    const result = await executePython(userCode);
    const actualOutput = result.output.trim();
    const expected = exercise.expectedOutput.trim();

    if (result.error && !result.output) {
      setOutput(`❌ Error:\n${result.error}`);
      setPassed(false);
      setIsRunning(false);
      return;
    }

    if (actualOutput === expected) {
      setOutput(`✅ Output:\n${actualOutput}\n\n🎉 Correct! Exercise completed! +20 coins`);
      setPassed(true);
      if (!alreadyCompleted) {
        completeExercise(exerciseKey);
        addWallet(20);
        toast({ title: "Exercise Passed! 🎉", description: "+20 coins added to your wallet." });
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#3b82f6", "#22c55e", "#eab308"],
        });
      }
    } else {
      setOutput(`Your output:\n${actualOutput || "(no output)"}\n\nExpected:\n${expected}\n\n❌ Not quite right. Check your code.`);
      setPassed(false);
    }

    setIsRunning(false);
  };

  if (locked) {
    return (
      <div className="bg-surface-1 border border-border rounded-lg p-4 opacity-70">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${levelColors[level]}`}>{level}</span>
          <span className="text-sm text-muted-foreground">Complete the previous exercise to unlock</span>
        </div>
      </div>
    );
  }

  const hint = exercise.hint || generateHint(exercise);
  const solution = exercise.solution || generateSolution(exercise);

  return (
    <div className={`border rounded-lg overflow-hidden transition-all ${
      alreadyCompleted ? "border-streak-green/30 bg-streak-green/5" : "border-border bg-card"
    }`}>
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
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
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

          {/* Hint & Solution panels */}
          {(showHint || showSolution) && (
            <div className="border-t border-border bg-muted/30 px-4 py-3 space-y-4">
              {showHint && !showSolution && (
                <div className="text-xs text-muted-foreground animate-in fade-in slide-in-from-top-1">
                  <span className="font-semibold text-python-yellow">💡 Hint:</span>{" "}
                  {hint}
                </div>
              )}
              {showSolution && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-1 border-t border-border/50 first:border-0 first:pt-0">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary/90 uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      ANS CODE
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
                Expected: <span className="text-foreground">{exercise.expectedOutput.split("\n")[0]}{exercise.expectedOutput.includes("\n") ? "..." : ""}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs gap-1 text-python-yellow/70 hover:text-python-yellow"
                  onClick={() => { setShowHint(!showHint); setShowSolution(false); }}
                >
                  <Lightbulb className="w-3 h-3" /> {showHint ? "Hide Hint" : "Hint"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs gap-1 text-primary/70 hover:text-primary transition-colors hover:bg-surface-2"
                  onClick={() => {
                    const nextVisible = !showSolution;
                    setShowHint(false);

                    if (nextVisible && !solutionUnlocked) {
                      if (unlockSolution(exerciseKey)) {
                        toast({ title: "Solution Unlocked!", description: "This solution is now saved for this exercise." });
                      } else {
                        toast({ title: "Not enough cash", description: "You need $70 to unlock this solution." });
                        return;
                      }
                    }

                    if (nextVisible) {
                      setCode(solution);
                    }

                    setShowSolution(nextVisible);
                  }}
                >
                  <Eye className="w-3 h-3" /> {showSolution ? "Hide Solution" : solutionUnlocked ? "Solution" : "Solution ($70)"}
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground" onClick={() => { setCode(exercise.starterCode); setOutput(""); setPassed(false); }}>
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
              <pre className={`px-4 py-3 text-xs font-mono whitespace-pre-wrap ${
                passed ? "text-streak-green" : "text-foreground"
              }`}>
                {output}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
