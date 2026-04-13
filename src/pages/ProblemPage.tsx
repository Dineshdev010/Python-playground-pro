// ============================================================
// PROBLEM PAGE — src/pages/ProblemPage.tsx
// Individual coding problem solver with Monaco editor,
// test case runner, solution reveal, and reward system.
// Resets editor state when navigating between problems.
// ============================================================
import React, { useState, useEffect, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
const Editor = React.lazy(() => import("@monaco-editor/react"));
import confetti from "canvas-confetti";
import { problems, getDifficultyColor, getDifficultyBg, getRecommendedSubjects } from "@/data/problems";
import { useProgress } from "@/contexts/ProgressContext";
import { getRewardForDifficulty } from "@/lib/progress";
import { cancelActivePythonExecution, executePython, getPythonExecutionTimeoutMs } from "@/lib/piston";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Play, Send, Eye, EyeOff, ArrowLeft, CheckCircle2, XCircle, Wallet, ChevronDown, ChevronUp, Square, Building2, BookOpenCheck } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CompanyBadge } from "@/components/CompanyBadge";


function normalizeOutput(output: string) {
  return output.replace(/\r\n/g, "\n").trim();
}

function getCallableName(code: string): string | null {
  const match = code.match(/def\s+([A-Za-z_]\w*)\s*\(/);
  return match?.[1] || null;
}

function buildTestHarness(code: string, callableName: string, input: string) {
  const hasInput = input.trim().length > 0;
  return `${code}

__payload = (${hasInput ? input : ""})
if ${hasInput ? "isinstance(__payload, tuple)" : "False"}:
    __args = list(__payload)
elif ${hasInput ? "True" : "False"}:
    __args = [__payload]
else:
    __args = []

__result = ${callableName}(*__args)
if __result is None and __args:
    print(repr(__args[0]))
else:
    print(repr(__result))
`;
}

export default function ProblemPage() {
  const { id } = useParams<{ id: string }>();
  const problem = problems.find(p => p.id === id);
  const { progress, solveProblem, addWallet } = useProgress();
  const isMobile = useIsMobile();
  const [code, setCode] = useState(problem?.starterCode || "");
  const [output, setOutput] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [solutionUnlocked, setSolutionUnlocked] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; input: string; expected: string }[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showDescription, setShowDescription] = useState(!isMobile);
  const [isRunning, setIsRunning] = useState(false);

  // ---------- Reset all state when problem changes ----------
  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode || "");
      setOutput("");
      setShowSolution(false);
      setSolutionUnlocked(false);
      setTestResults(null);
      setSubmitted(false);
      setIsRunning(false);
    }
  }, [id, problem]);

  useEffect(() => {
    setShowDescription(!isMobile);
  }, [id, isMobile]);

  if (!problem) {
    return <div className="p-8 text-center text-red-500">Problem not found.</div>;
  }

  const canonical = `https://pymaster.pro/problems/${problem.id}`;
  const solved = progress.solvedProblems.includes(problem.id);
  const reward = getRewardForDifficulty(problem.difficulty);
  const problemIndex = problems.findIndex(p => p.id === id);
  const prevProblem = problemIndex > 0 ? problems[problemIndex - 1] : null;
  const nextProblem = problemIndex < problems.length - 1 ? problems[problemIndex + 1] : null;
  const serial = problemIndex + 1;
  const timeoutSeconds = Math.round(getPythonExecutionTimeoutMs() / 1000);
  const recommendedSubjects = getRecommendedSubjects(problem);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("⏳ Running...");
    setTestResults(null);

    const result = await executePython(code);

    if (result.error && !result.output) {
      setOutput(`❌ Error:\n${result.error}`);
    } else if (result.output) {
      setOutput(`📺 Output:\n${result.output}`);
    } else {
      setOutput("(No output — add print() statements to see results)");
    }

    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setOutput("⏳ Running tests...");

    const callableName = getCallableName(code);
    const results: { passed: boolean; input: string; expected: string }[] = [];
    let combinedOutput = "";

    if (callableName) {
      for (const testCase of problem.testCases) {
        const result = await executePython(buildTestHarness(code, callableName, testCase.input));
        const actualOutput = normalizeOutput(result.output);
        const expectedOutput = normalizeOutput(testCase.expected);
        const passed = !result.error && actualOutput === expectedOutput;
        results.push({ passed, input: testCase.input, expected: testCase.expected });

        if (result.error && !result.output) {
          setOutput(`❌ Error:\n${result.error}`);
          setTestResults(results);
          setIsRunning(false);
          return;
        }

        combinedOutput += `Test ${results.length}: ${actualOutput || "(no output)"}\n`;
      }
    } else {
      const result = await executePython(code);
      const actualOutput = normalizeOutput(result.output);
      const expectedOutput = normalizeOutput(problem.testCases[0]?.expected || "");

      if (result.error && !result.output) {
        setOutput(`❌ Error:\n${result.error}`);
        setTestResults(null);
        setIsRunning(false);
        return;
      }

      results.push({
        passed: actualOutput === expectedOutput,
        input: problem.testCases[0]?.input || "",
        expected: problem.testCases[0]?.expected || "",
      });
      combinedOutput = actualOutput || "(no output)";
    }

    setTestResults(results);
    const allPassed = results.every(r => r.passed);

    if (allPassed && !solved) {
      setSubmitted(true);
      solveProblem(problem.id, problem.difficulty);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#22c55e", "#eab308"],
      });
      setOutput(`🎉 All tests passed!\n\n📺 Output:\n${combinedOutput.trim()}\n\n💰 You earned $${reward}!\n🔥 Streak updated!`);
    } else if (allPassed && solved) {
      setOutput(`✅ All tests passed!\n\n📺 Output:\n${combinedOutput.trim()}\n\n(Already solved)`);
    } else {
      setOutput(`📺 Test output:\n${combinedOutput.trim() || "(no output)"}\n\n❌ Some tests failed. Check your solution.`);
    }

    setIsRunning(false);
  };

  // Generate structured JSON-LD data for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": problem.title,
    "description": problem.description,
    "educationalLevel": problem.difficulty,
    "learningResourceType": "Programming Challenge"
  };

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <Helmet>
        <title>{problem.title} | PyMaster Problems</title>
        <meta name="description" content={`Solve ${problem.title} in Python. ${problem.description.substring(0, 100)}... Challenge yourself with our built-in compiler.`} />
        <meta property="og:title" content={`${problem.title} - Python Coding Challenge`} />
        <meta property="og:description" content={`Solve ${problem.title} in Python. ${problem.description.substring(0, 140)}...`} />
        <meta property="og:url" content={canonical} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Problem toolbar */}
      <div className="h-auto min-h-[3rem] bg-surface-1 border-b border-border flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 gap-2 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1 shrink-0">
            <Link to="/problems"><ArrowLeft className="w-3 h-3" /> <span className="hidden sm:inline">Problems</span></Link>
          </Button>
          <span className="w-7 h-7 rounded-md bg-surface-2 border border-border flex items-center justify-center text-[10px] font-mono text-muted-foreground shrink-0">
            {serial}
          </span>
          <span className="text-sm font-medium text-foreground truncate">{problem.title}</span>
          <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border capitalize shrink-0 ${getDifficultyBg(problem.difficulty)} ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          {solved && <CheckCircle2 className="w-4 h-4 text-streak-green shrink-0" />}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {prevProblem && (
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs px-2">
              <Link to={`/problems/${prevProblem.id}`}>← <span className="hidden sm:inline">Prev</span></Link>
            </Button>
          )}
          {nextProblem && (
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs px-2">
              <Link to={`/problems/${nextProblem.id}`}><span className="hidden sm:inline">Next</span> →</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Split panes */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left: Problem description */}
        <div className={`md:w-[45%] overflow-y-auto border-b md:border-b-0 md:border-r border-border shrink-0 ${showDescription ? "h-[35vh] md:h-auto" : "hidden md:block"}`}>
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="md:hidden w-full flex items-center justify-between px-4 py-2 bg-surface-1 border-b border-border text-xs text-muted-foreground"
          >
            📋 Problem Description
            {showDescription ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-muted-foreground font-mono">#{serial}</span>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">{problem.title}</h2>
            </div>

            <div className="space-y-3 mb-6">
              {problem.description.split("\n").map((line, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                  {line.startsWith("- ") ? <span className="ml-4 list-item list-disc">{line.slice(2)}</span> : line}
                </p>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-3">📝 Examples</h3>
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-surface-1 border border-border rounded-lg p-3 sm:p-4 mb-3">
                <div className="text-xs font-mono text-muted-foreground mb-1">Input: <span className="text-foreground break-all">{ex.input}</span></div>
                <div className="text-xs font-mono text-muted-foreground">Output: <span className="text-foreground break-all">{ex.output}</span></div>
                {ex.explanation && <div className="text-xs text-muted-foreground mt-2">💡 {ex.explanation}</div>}
              </div>
            ))}

            <h3 className="text-sm font-semibold text-foreground mb-2 mt-4">⚠️ Constraints</h3>
            <ul className="space-y-1 mb-6">
              {problem.constraints.map((c, i) => (
                <li key={i} className="text-xs text-muted-foreground font-mono break-all">• {c}</li>
              ))}
            </ul>

            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-4 h-4 text-reward-gold" />
              <span className="text-sm text-reward-gold font-medium">💰 ${reward} reward</span>
            </div>

            {problem.companies?.length ? (
              <div className="mb-4 rounded-lg border border-border bg-surface-1 p-3 sm:p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  Companies that ask this question
                </div>
                <div className="flex flex-wrap gap-2">
                  {problem.companies.map((company) => (
                    <CompanyBadge key={company} company={company} />
                  ))}
                </div>
              </div>
            ) : null}

            {recommendedSubjects.length ? (
              <div className="mb-4 rounded-lg border border-border bg-surface-1 p-3 sm:p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <BookOpenCheck className="h-4 w-4 text-primary" />
                  Learn these subjects first
                </div>
                <p className="mb-3 text-xs leading-5 text-muted-foreground">
                  These topics will make this problem much easier to understand and solve.
                </p>
                <div className="flex flex-wrap gap-2">
                  {recommendedSubjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 text-xs" 
              onClick={() => {
                if (showSolution) {
                  setShowSolution(false);
                } else if (!solutionUnlocked) {
                  if (progress.wallet >= 70) {
                    addWallet(-70);
                    setSolutionUnlocked(true);
                    setShowSolution(true);
                    if (problem.solution) setCode(problem.solution);
                    toast({
                      title: "Solution Unlocked!",
                      description: "Deducted $70 from your wallet.",
                    });
                  } else {
                    toast({
                      title: "Not enough wallet cash!",
                      description: "You need $70 to unlock the solution. Keep solving problems to earn more!",
                      variant: "destructive",
                    });
                  }
                } else {
                  setShowSolution(true);
                  if (problem.solution) setCode(problem.solution);
                }
              }}
            >
              {showSolution ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showSolution ? "Hide Solution" : "👀 Reveal Solution ($70)"}
            </Button>
            {showSolution && (
              <div className="mt-4">
                <div className="code-block mb-3">
                  <pre className="p-3 sm:p-4 text-xs font-mono text-foreground overflow-x-auto">{problem.solution}</pre>
                </div>
                <p className="text-xs text-muted-foreground">{problem.solutionExplanation}</p>
              </div>
            )}
          </div>
        </div>

        {!showDescription && (
          <button
            onClick={() => setShowDescription(true)}
            className="md:hidden flex flex-col items-center justify-center gap-1 px-4 py-3 bg-surface-2 border-b border-border text-xs font-semibold text-foreground hover:bg-surface-3 transition-colors shrink-0"
          >
            <ChevronDown className="w-4 h-4 text-primary" /> View Problem Description
          </button>
        )}

        {/* Right: Editor + Output */}
        <div className="flex-1 flex flex-col min-h-0">
            <Suspense fallback={<div className="flex w-full h-full items-center justify-center bg-surface-0"><span className="text-sm font-semibold tracking-wider text-muted-foreground animate-pulse">Loading Compiler Engine...</span></div>}>
              <Editor
                key={id}
                height="100%"
                language="python"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v || "")}
                loading={<div className="flex w-full h-full items-center justify-center"><span className="text-sm text-muted-foreground animate-pulse">Loading compiler engine...</span></div>}
                options={{
                  fontSize: isMobile ? 12 : 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: false },
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                  lineNumbers: isMobile ? "off" : "on",
                }}
              />
            </Suspense>

          <div className="h-48 border-t border-border bg-surface-0 flex flex-col shrink-0">
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-border bg-surface-1">
              <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">📺 Output</span>
              <div className="flex gap-2">
                {isRunning ? (
                  <Button size="sm" variant="destructive" className="h-7 text-xs gap-1 px-2 sm:px-3" onClick={cancelActivePythonExecution}>
                    <Square className="w-3 h-3" />
                    <span className="hidden sm:inline">Stop</span>
                  </Button>
                ) : (
                  <>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1 px-2 sm:px-3" onClick={handleRun}>
                      <Play className="w-3 h-3" />
                      <span className="hidden sm:inline">▶ Run</span>
                    </Button>
                    <Button size="sm" className="h-7 text-xs gap-1 px-2 sm:px-3" onClick={handleSubmit}>
                      <Send className="w-3 h-3" />
                      <span className="hidden sm:inline">🚀 Submit</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-3 sm:p-4">
              {!output && (
                <p className="text-[11px] text-muted-foreground mb-3">
                  Runs in an isolated browser worker with a {timeoutSeconds}s safety timeout.
                </p>
              )}
              {testResults && (
                <div className="space-y-1.5 mb-3">
                  {testResults.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono flex-wrap">
                      {r.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-streak-green shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-destructive shrink-0" />}
                      <span className="text-muted-foreground">Test {i + 1}:</span>
                      <span className="text-foreground break-all">{r.input}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className={`break-all ${r.passed ? "text-streak-green" : "text-destructive"}`}>{r.expected}</span>
                    </div>
                  ))}
                </div>
              )}
              {submitted && (
                <div className="flex items-center gap-3 p-3 bg-streak-green/10 border border-streak-green/30 rounded-lg mb-3">
                  <CheckCircle2 className="w-5 h-5 text-streak-green shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">🎉 All tests passed!</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-reward-gold">💰 +${reward}</span>
                      <span className="text-python-yellow">🔥 Streak updated</span>
                    </p>
                  </div>
                </div>
              )}
              <pre className="text-xs sm:text-sm font-mono text-foreground whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
