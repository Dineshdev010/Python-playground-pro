// ============================================================
// COMPILER PAGE — src/pages/CompilerPage.tsx
// A browser-based Python code editor and runner.
// Uses Monaco Editor for code editing and Pyodide (WASM)
// for executing Python entirely in the browser.
// Includes pre-built code templates for quick starts.
// ============================================================

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, FileCode, Square, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/contexts/ProgressContext";
import {
  cancelActivePythonExecution,
  executePython,
  getPythonExecutionTimeoutMs,
  getPythonRuntimeError,
  getPythonRuntimeStatus,
  preloadPyodide,
  subscribePythonRuntimeStatus,
  type PythonRuntimeStatus,
} from "@/lib/piston";
import { useIsMobile } from "@/hooks/use-mobile";

// ---------- Pre-built code templates ----------
// Users can select these from the dropdown to quickly try different concepts
const templates: Record<string, string> = {
  "Hello World": `# Hello World\nprint("Hello, World!")`,
  "Variables": `# Variables\nname = "Python"\nage = 30\nprint(f"{name} is {age} years old")`,
  "List Comprehension": `# List Comprehension\nsquares = [x**2 for x in range(10)]\nprint(squares)`,
  "Function": `# Function\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))`,
  "Class": `# Class\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return f"{self.name} says Woof!"\n\ndog = Dog("Rex")\nprint(dog.bark())`,
  "Fibonacci": `# Fibonacci Sequence\ndef fib(n):\n    a, b = 0, 1\n    result = []\n    for _ in range(n):\n        result.append(a)\n        a, b = b, a + b\n    return result\n\nprint(fib(15))`,
  "Dictionary": `# Dictionary operations\nstudent = {"name": "Alice", "age": 22, "grade": "A"}\n\nfor key, value in student.items():\n    print(f"{key}: {value}")`,
};

export default function CompilerPage() {
  // ---------- State ----------
  const [searchParams] = useSearchParams();
  // Initialize code from URL param (from "Try in Compiler" links) or default template
  const [code, setCode] = useState(searchParams.get("code") || templates["Hello World"]);
  const [output, setOutput] = useState("");           // Output from Python execution
  const [isRunning, setIsRunning] = useState(false);  // Whether code is currently executing
  const [executionTime, setExecutionTime] = useState<number | null>(null); // Execution time in ms
  const [runtimeStatus, setRuntimeStatus] = useState<PythonRuntimeStatus>(getPythonRuntimeStatus());
  const [runtimeError, setRuntimeError] = useState(getPythonRuntimeError());
  const [isEditorMounted, setIsEditorMounted] = useState(false);
  const [showEditorFallback, setShowEditorFallback] = useState(false);
  const [mobileView, setMobileView] = useState<"program" | "output">("program");
  const editorPanelRef = useRef<HTMLDivElement | null>(null);
  const outputPanelRef = useRef<HTMLDivElement | null>(null);
  const { logActivity } = useProgress();              // Record activity for streak
  const isMobile = useIsMobile();
  const timeoutSeconds = Math.round(getPythonExecutionTimeoutMs() / 1000);

  // Update code when URL search param changes (e.g., navigating from a lesson)
  useEffect(() => {
    const c = searchParams.get("code");
    if (c) setCode(c);
  }, [searchParams]);

  useEffect(() => {
    preloadPyodide();
    return subscribePythonRuntimeStatus((status, error) => {
      setRuntimeStatus(status);
      setRuntimeError(error);
    });
  }, []);

  useEffect(() => {
    if (isEditorMounted) return;
    const timer = window.setTimeout(() => {
      setShowEditorFallback(true);
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [isEditorMounted]);

  useEffect(() => {
    if (!isMobile) {
      setMobileView("program");
    }
  }, [isMobile]);

  // ---------- Run Python code ----------
  // Executes the code using Pyodide (WebAssembly) in the browser
  const runCode = async () => {
    setIsRunning(true);
    setOutput(runtimeStatus === "ready" ? "" : "⏳ Python runtime is loading in your browser. First run may take a little longer...");
    setExecutionTime(null);

    // Measure execution time
    const startTime = performance.now();

    // Execute using Pyodide WASM engine
    const result = await executePython(code);
    const elapsed = performance.now() - startTime;
    setExecutionTime(Math.round(elapsed));

    // Format the output based on result
    let outputText = "";
    if (result.error) {
      // Show errors (and any partial output before the error)
      outputText = result.output
        ? result.output + "\n⚠️ Errors:\n" + result.error
        : "❌ Error:\n" + result.error;
    } else if (result.output) {
      outputText = result.output;
    } else {
      outputText = "(No output — add print() statements to see results)";
    }

    setOutput(outputText);
    setIsRunning(false);
    // Log activity for streak tracking
    logActivity();
  };

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col md:h-[calc(100vh-3.5rem)]">
      {/* ---------- Toolbar ---------- */}
      <div className="h-auto min-h-[3rem] bg-surface-1 border-b border-border flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground hidden sm:inline">🐍 Python Playground</span>
          <span className="text-sm font-medium text-foreground sm:hidden">🐍 Python</span>
          {/* Badge showing this runs in browser via WebAssembly */}
          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            🌐 Browser WASM
          </span>
          <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${
            runtimeStatus === "ready"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
              : runtimeStatus === "error"
                ? "border-destructive/20 bg-destructive/10 text-destructive"
                : "border-amber-500/20 bg-amber-500/10 text-amber-600"
          }`}>
            {runtimeStatus === "ready" ? "Ready" : runtimeStatus === "error" ? "Runtime Error" : "Loading Runtime"}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Template selector dropdown */}
          <select
            className="bg-secondary text-foreground text-xs h-8 px-2 py-1.5 rounded-md border border-border w-full sm:w-auto"
            onChange={(e) => setCode(templates[e.target.value])}
            defaultValue=""
          >
            <option value="" disabled>📝 Templates</option>
            {Object.keys(templates).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          {/* Clear button — resets code and output */}
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1 flex-1 sm:flex-none" onClick={() => { setCode(""); setOutput(""); setExecutionTime(null); }}>
            <RotateCcw className="w-3 h-3" /> Clear
          </Button>
          {/* Run button — executes the Python code */}
          {isRunning ? (
            <Button size="sm" variant="destructive" className="h-8 text-xs gap-1 flex-1 sm:flex-none" onClick={cancelActivePythonExecution}>
              <Square className="w-3 h-3" /> Stop
            </Button>
          ) : (
            <Button size="sm" className="h-8 text-xs gap-1 flex-1 sm:flex-none" onClick={runCode}>
              <Play className="w-3 h-3" />
              ▶ Run
            </Button>
          )}
          <Button
            size="sm"
            variant={isMobile && mobileView === "program" ? "default" : "outline"}
            className="h-8 text-xs gap-1 flex-1 sm:flex-none"
            onClick={() => {
              if (isMobile) {
                setMobileView("program");
                return;
              }
              editorPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <FileCode className="w-3 h-3" /> Program
          </Button>
          <Button
            size="sm"
            variant={isMobile && mobileView === "output" ? "default" : "outline"}
            className="h-8 text-xs gap-1 flex-1 sm:flex-none"
            onClick={() => {
              if (isMobile) {
                setMobileView("output");
                return;
              }
              outputPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <Terminal className="w-3 h-3" /> Output
          </Button>
        </div>
      </div>

      {/* ---------- Editor + Output split view ---------- */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-y-auto">
        {/* Monaco code editor (left/top panel) */}
        <div
          ref={editorPanelRef}
          className={`${isMobile && mobileView === "output" ? "hidden" : "block"} flex-1 min-h-[52vh] md:min-h-0`}
        >
          {showEditorFallback && !isEditorMounted ? (
            <div className="h-full bg-surface-0 border-b md:border-b-0 md:border-r border-border p-3 sm:p-4 flex flex-col gap-3">
              <div className="text-xs text-muted-foreground">
                Editor engine is taking longer than expected on this device. Fallback editor is active.
              </div>
              <textarea
                className="flex-1 min-h-[45vh] md:min-h-0 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm font-mono text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                aria-label="Python code editor fallback"
              />
            </div>
          ) : (
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
              onMount={() => {
                setIsEditorMounted(true);
                setShowEditorFallback(false);
              }}
              loading={
                <div className="h-full w-full flex items-center justify-center bg-surface-0">
                  <span className="text-sm text-muted-foreground animate-pulse">Loading editor...</span>
                </div>
              }
              options={{
                fontSize: isMobile ? 13 : 14,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                lineNumbers: isMobile ? "off" : "on",
                renderLineHighlight: "gutter",
                automaticLayout: true,
              }}
            />
          )}
        </div>
        {/* Output panel (right/bottom panel) */}
        <div
          ref={outputPanelRef}
          className={`${isMobile && mobileView === "program" ? "hidden" : "flex"} md:w-96 ${isMobile ? "flex-1 min-h-0" : "h-[40vh] min-h-[14rem] md:h-auto"} border-t md:border-t-0 md:border-l border-border bg-surface-0 flex-col`}
        >
          {/* Output header with execution time */}
          <div className="px-4 py-2 border-b border-border bg-surface-1 text-xs text-muted-foreground font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              📺 Output
            </span>
            {executionTime !== null && (
              <span className="text-[10px] text-muted-foreground">⏱ {executionTime}ms</span>
            )}
          </div>
          {/* Output text area */}
          <pre className={`flex-1 p-4 text-[13px] sm:text-sm font-mono overflow-auto whitespace-pre-wrap ${
            output.includes("❌") || output.includes("⚠️") ? "text-destructive" : "text-foreground"
          }`}>
            {isRunning ? (
              <span className="text-muted-foreground animate-pulse">
                {runtimeStatus === "ready"
                  ? "⏳ Running Python in browser worker..."
                  : "⏳ Loading Python runtime and preparing browser worker..."}
              </span>
            ) : (
              output ||
              (runtimeStatus === "error"
                ? `❌ Runtime failed to load.\n${runtimeError || "Please refresh and try again."}`
                : runtimeStatus === "loading"
                  ? "Python runtime is warming up in the background. Your first run should feel faster once loading completes."
                  : `Click '▶ Run' to execute your code locally. Runs in an isolated browser worker with a ${timeoutSeconds}s safety timeout.`)
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
