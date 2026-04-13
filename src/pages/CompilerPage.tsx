// ============================================================
// COMPILER PAGE — src/pages/CompilerPage.tsx
// Multi-language browser-based code runner.
// Supports Python, Pandas, Linux terminal simulator, and SQL.
// Uses Monaco Editor + Pyodide WASM + GitSimulator + sqlRunner.
// ============================================================

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, FileCode, Square, Brain, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { analyzePythonCode } from "@/utils/PyBrainUtils";
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
import { executeSql } from "@/lib/sqlRunner";
import { GitSimulator } from "@/lib/gitSimulator";
import { useIsMobile } from "@/hooks/use-mobile";

// ---------- Language Modes ----------
type LangMode = "python" | "pandas" | "linux" | "sql";

const LANG_CONFIG: Record<LangMode, { label: string; emoji: string; monacoLang: string; color: string }> = {
  python:  { label: "Python",  emoji: "🐍", monacoLang: "python", color: "text-blue-400"   },
  pandas:  { label: "Pandas",  emoji: "🐼", monacoLang: "python", color: "text-purple-400" },
  linux:   { label: "Linux",   emoji: "🐧", monacoLang: "shell",  color: "text-orange-400" },
  sql:     { label: "SQL",     emoji: "🗄️",  monacoLang: "sql",    color: "text-emerald-400"},
};

// ---------- Starter templates per mode ----------
const TEMPLATES: Record<LangMode, Record<string, string>> = {
  python: {
    "Hello World":       `# Hello World\nprint("Hello, World!")`,
    "Variables":         `# Variables\nname = "Python"\nage = 30\nprint(f"{name} is {age} years old")`,
    "List Comprehension":`# List Comprehension\nsquares = [x**2 for x in range(10)]\nprint(squares)`,
    "Function":          `# Function\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))`,
    "Class":             `# Class\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return f"{self.name} says Woof!"\n\ndog = Dog("Rex")\nprint(dog.bark())`,
    "Fibonacci":         `# Fibonacci Sequence\ndef fib(n):\n    a, b = 0, 1\n    result = []\n    for _ in range(n):\n        result.append(a)\n        a, b = b, a + b\n    return result\n\nprint(fib(15))`,
    "Dictionary":        `# Dictionary operations\nstudent = {"name": "Alice", "age": 22, "grade": "A"}\n\nfor key, value in student.items():\n    print(f"{key}: {value}")`,
  },
  pandas: {
    "DataFrame Basics":   `import pandas as pd\n\n# Create a DataFrame\ndata = {"Name": ["Alice", "Bob", "Charlie"], "Score": [92, 85, 78]}\ndf = pd.DataFrame(data)\nprint(df)\nprint("\\nMean score:", df["Score"].mean())`,
    "Filter Rows":        `import pandas as pd\n\ndata = {"Name": ["Alice", "Bob", "Charlie"], "Score": [92, 85, 78]}\ndf = pd.DataFrame(data)\n\n# Filter students with score > 80\nhigh = df[df["Score"] > 80]\nprint(high)`,
    "GroupBy":            `import pandas as pd\n\ndata = {"City": ["Delhi", "Mumbai", "Delhi", "Mumbai"], "Sales": [100, 200, 150, 300]}\ndf = pd.DataFrame(data)\n\n# Group and sum\nprint(df.groupby("City")["Sales"].sum())`,
    "Describe Stats":     `import pandas as pd\n\ndata = {"Value": [10, 20, 30, 40, 50, 60, 70]}\ndf = pd.DataFrame(data)\nprint(df.describe())`,
    "Read CSV (inline)":  `import pandas as pd\nimport io\n\ncsv_data = """Name,Age,Score\nAlice,22,90\nBob,25,85\nCharlie,23,78\n"""\ndf = pd.read_csv(io.StringIO(csv_data))\nprint(df)\nprint("\\nOldest:", df.loc[df["Age"].idxmax(), "Name"])`,
  },
  linux: {
    "System Info":    "uname -a",
    "List Files":     "ls -la",
    "Current Dir":    "pwd",
    "Who Am I":       "whoami",
    "Environment":    "echo $HOME",
    "Create File":    "touch hello.txt",
    "Make Directory": "mkdir projects",
    "Git Init":       "git init",
  },
  sql: {
    "Select All":       `-- Available tables: customers, products, orders, order_items\nSELECT * FROM customers;`,
    "Filter Rows":      `-- Customers from Mumbai\nSELECT name, city FROM customers\nWHERE city = 'Mumbai';`,
    "Order By":         `-- Most expensive products first\nSELECT name, price FROM products\nORDER BY price DESC;`,
    "Group By":         `-- Count customers per city\nSELECT city, COUNT(*) AS total\nFROM customers\nGROUP BY city\nORDER BY total DESC;`,
    "JOIN":             `-- Orders with customer names\nSELECT o.id, c.name, o.status, o.order_date\nFROM orders o\nJOIN customers c ON o.customer_id = c.id;`,
    "Multi-Join":       `-- Analyze product performance with reviews\nSELECT p.name, p.category, \n       COUNT(r.id) as review_count, \n       AVG(r.rating) as avg_rating\nFROM products p\nLEFT JOIN product_reviews r ON p.id = r.product_id\nGROUP BY p.id\nORDER BY avg_rating DESC;`,
    "Aggregate":        `-- Total revenue per product category\nSELECT p.category,\n       SUM(p.price * oi.quantity) AS revenue\nFROM products p\nJOIN order_items oi ON p.id = oi.product_id\nGROUP BY p.category\nORDER BY revenue DESC;`,
    "Subquery":         `-- Customers who placed at least one completed order\nSELECT name FROM customers\nWHERE id IN (\n  SELECT DISTINCT customer_id FROM orders\n  WHERE status = 'completed'\n);`,
    "Create Table":     `-- Create your own custom table\nCREATE TABLE IF NOT EXISTS notes (\n  id   INTEGER PRIMARY KEY,\n  text TEXT NOT NULL\n);\nINSERT INTO notes VALUES (1, 'SQL is fun!'), (2, 'JOIN connects tables');\nSELECT * FROM notes;`,
    "Update & Delete":  `-- Update product price + delete cancelled orders\nUPDATE products SET price = 999 WHERE name = 'Mouse';\nDELETE FROM orders WHERE status = 'cancelled';\nSELECT name, price FROM products WHERE name = 'Mouse';\nSELECT id, status FROM orders;`,
  },
};

// ---------- SQL Table View Component ----------
function downloadCsv(csvText: string, filename = "query_result.csv") {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(cell.trim());
      cell = "";
    } else {
      cell += char;
    }
  }
  result.push(cell.trim());
  return result;
}

function SqlTableView({ csvOutput }: { csvOutput: string }) {
  const lines = csvOutput.trim().split("\n");
  if (lines.length === 0 || !csvOutput.includes(",")) {
    return <pre className="p-4 text-sm font-mono text-foreground whitespace-pre-wrap">{csvOutput}</pre>;
  }

  const headers = splitCsvLine(lines[0]);
  const rows = lines.slice(1).map(line => splitCsvLine(line));

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full overflow-hidden px-3 pb-2 pt-2">
      <div className="flex-1 min-h-0 overflow-auto border border-border rounded-lg bg-surface-1 shadow-md custom-scrollbar">
        <table className="w-full text-left border-collapse table-auto">
          <thead className="sticky top-0 z-30 shadow-sm bg-surface-1 ring-1 ring-border">
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-2.5 text-[11px] font-bold text-python-blue uppercase tracking-widest whitespace-nowrap bg-surface-1 ${
                    i === 0 ? "sticky left-0 z-40 border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.1)]" : ""
                  }`}
                >
                  {h.replace(/^"|"$/g, '')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-surface-2 transition-colors duration-150 group">
                {row.map((cell, j) => {
                  const cleanCell = cell.replace(/^"|"$/g, '').replace(/""/g, '"');
                  return (
                    <td
                      key={j}
                      className={`px-4 py-2 text-xs font-mono text-foreground/90 group-hover:text-foreground whitespace-nowrap ${
                        j === 0 ? "sticky left-0 z-10 bg-surface-1 group-hover:bg-surface-2 border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.1)]" : ""
                      }`}
                    >
                      {cleanCell === "NULL" ? (
                        <span className="text-muted-foreground/50 italic font-sans text-[10px]">null</span>
                      ) : (
                        cleanCell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="shrink-0 flex items-center justify-between pt-1.5 text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">
        <span>SQL · Query Executed</span>
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
            {rows.length} {rows.length === 1 ? 'row' : 'rows'} returned
          </span>
          <button
            onClick={() => downloadCsv(csvOutput)}
            title="Download as CSV"
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-streak-green/10 text-streak-green border border-streak-green/20 hover:bg-streak-green/20 transition-colors font-semibold text-[10px] uppercase tracking-tighter"
          >
            ⬇ CSV
          </button>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_CODE: Record<LangMode, string> = {
  python: TEMPLATES.python["Hello World"],
  pandas: TEMPLATES.pandas["DataFrame Basics"],
  linux:  "# Welcome to Linux Sandbox\n# Try: ls, pwd, uname -a, ps aux, git status",
  sql:    TEMPLATES.sql["Select All"],
};

// localStorage helpers for code persistence
const LS_KEY = (mode: LangMode) => `pymaster_code_${mode}`;
function loadSavedCode(mode: LangMode): string {
  try { return localStorage.getItem(LS_KEY(mode)) || DEFAULT_CODE[mode]; } catch { return DEFAULT_CODE[mode]; }
}
function saveCode(mode: LangMode, code: string) {
  try { localStorage.setItem(LS_KEY(mode), code); } catch { /* ignore */ }
}

const HISTORY_KEY = (mode: LangMode) => `pymaster_history_${mode}`;
function getHistory(mode: LangMode): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY(mode)) || "[]"); } catch { return []; }
}
function addToHistory(mode: LangMode, codeSnippet: string) {
  try {
    const hist = getHistory(mode);
    const newHist = [codeSnippet, ...hist.filter(c => c !== codeSnippet)].slice(0, 10);
    localStorage.setItem(HISTORY_KEY(mode), JSON.stringify(newHist));
  } catch { /* ignore */ }
}

export default function CompilerPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode]     = useState<LangMode>("python");
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [code, setCode]     = useState(searchParams.get("code") || loadSavedCode("python"));
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning]           = useState(false);
  const [executionTime, setExecutionTime]   = useState<number | null>(null);
  const [runtimeStatus, setRuntimeStatus]   = useState<PythonRuntimeStatus>(getPythonRuntimeStatus());
  const [runtimeError, setRuntimeError]     = useState(getPythonRuntimeError());
  const [isEditorMounted, setIsEditorMounted]   = useState(false);
  const [isBrainOpen, setIsBrainOpen]       = useState(false);
  const [executionHistory, setExecutionHistory] = useState<{runId: number; time: number}[]>([]);
  const [activeTab, setActiveTab]           = useState<"output" | "performance">("output");
  const [sqlSplit, setSqlSplit]             = useState(50); // percentage for editor height in SQL mode
  const [history, setHistory]               = useState<string[]>([]);
  const isDraggingRef                       = useRef(false);
  const containerRef                        = useRef<HTMLDivElement>(null);
  const { theme }                           = useTheme();

  // Linux terminal state
  const [linuxInput, setLinuxInput]         = useState("");
  const [linuxHistory, setLinuxHistory]     = useState<{ type: "in" | "out"; text: string }[]>([
    { type: "out", text: "🐧 PyMaster Linux Sandbox — Type commands below. Try: ls, pwd, uname -a, git status" }
  ]);
  const [histIdx, setHistIdx]               = useState(-1);  // command history navigation index
  const cmdHistRef                          = useRef<string[]>([]); // typed command history
  const linuxSim = useMemo(() => new GitSimulator(), []);
  const linuxTermRef = useRef<HTMLDivElement>(null);
  const linuxInputRef = useRef<HTMLInputElement>(null);

  const editorPanelRef = useRef<HTMLDivElement | null>(null);
  const outputPanelRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const { logActivity } = useProgress();
  const isMobile = useIsMobile();
  const timeoutSeconds = Math.round(getPythonExecutionTimeoutMs() / 1000);

  // Scroll linux terminal to bottom
  useEffect(() => {
    if (linuxTermRef.current) {
      linuxTermRef.current.scrollTop = linuxTermRef.current.scrollHeight;
    }
  }, [linuxHistory]);

  // URL code param
  useEffect(() => {
    const c = searchParams.get("code");
    if (c) setCode(c);
  }, [searchParams]);

  useEffect(() => {
    preloadPyodide();
    setHistory(getHistory(mode));
    return subscribePythonRuntimeStatus((status, error) => {
      setRuntimeStatus(status);
      setRuntimeError(error);
    });
  }, [mode]);


  // Drag-to-resize handler for SQL split
  const handleResizerMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const onMove = (clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((clientY - rect.top) / rect.height) * 100;
      setSqlSplit(Math.min(80, Math.max(20, pct)));
    };

    const onMouseMove = (ev: MouseEvent) => onMove(ev.clientY);
    const onTouchMove = (ev: TouchEvent) => onMove(ev.touches[0].clientY);
    const onUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
  };


  // Save code to localStorage whenever it changes (debounced via useEffect)
  useEffect(() => {
    const t = setTimeout(() => saveCode(mode, code), 800);
    return () => clearTimeout(t);
  }, [code, mode]);

  // Auto-correct stale SQL code that references the non-existent 'students' table
  useEffect(() => {
    if (mode === "sql" && code.includes("FROM students")) {
      setCode(DEFAULT_CODE.sql);
      setOutput("");
    }
  }, [mode, code]);

  // ---------- Handle mode switch ----------
  const switchMode = (newMode: LangMode) => {
    setMode(newMode);
    setShowModeMenu(false);
    setCode(loadSavedCode(newMode));   // restore last saved code for this mode
    setHistory(getHistory(newMode));
    setActiveTab("output");
    setOutput("");
    setExecutionTime(null);
    setExecutionHistory([]);
  };

  // ---------- Run Code ----------
  const runCode = async () => {
    if (mode === "linux") return; // Linux uses its own flow

    setIsRunning(true);
    setActiveTab("output");

    // Pandas needs to download the package from CDN on first run — show a helpful message
    if (mode === "pandas") {
      setOutput("⏳ Loading Pandas from Pyodide CDN...\nThis may take 20-60 seconds on the first run.\nSubsequent runs will be instant once the package is cached.");
    } else {
      setOutput(runtimeStatus === "ready" ? "" : "⏳ Python runtime is loading...");
    }

    setExecutionTime(null);
    const startTime = performance.now();

    let result;
    if (mode === "sql") {
      result = await executeSql(code);
    } else if (mode === "pandas") {
      // Pandas needs a much longer timeout — package download takes 30-120s on first load
      result = await executePython(code, { timeoutMs: 180_000 });
    } else {
      result = await executePython(code);
    }

    const elapsed = Math.round(performance.now() - startTime);
    setExecutionTime(elapsed);
    setExecutionHistory(prev => [...prev, { runId: prev.length + 1, time: elapsed }]);

    let outputText = "";
    if (result.error) {
      outputText = result.output
        ? result.output + "\n⚠️ Errors:\n" + result.error
        : "❌ Error:\n" + result.error;
    } else if (result.output) {
      outputText = result.output;
    } else {
      outputText = "(No output — add print() / SELECT to see results)";
    }

    setOutput(outputText);
    setIsRunning(false);
    logActivity();

    if (!result.error && code.trim()) {
      addToHistory(mode, code);
      setHistory(getHistory(mode));
    }
  };

  // ---------- Linux command handler ----------
  const handleLinuxCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = linuxInput.trim();
    if (!cmd) return;
    cmdHistRef.current = [cmd, ...cmdHistRef.current].slice(0, 100);
    setHistIdx(-1);
    setLinuxInput("");

    const result = linuxSim.executeCommand(cmd);
    if (result === "CLEAR_TERMINAL") {
      setLinuxHistory([{ type: "out", text: "🐧 Terminal cleared." }]);
      return;
    }

    const newEntries: { type: "in" | "out"; text: string }[] = [{ type: "in", text: cmd }];
    if (result) newEntries.push({ type: "out", text: result });
    setLinuxHistory(prev => [...prev, ...newEntries]);
  };

  const handleLinuxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistRef.current.length - 1);
      setHistIdx(next);
      setLinuxInput(cmdHistRef.current[next] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setLinuxInput(next === -1 ? "" : cmdHistRef.current[next] || "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Simple tab completion on known commands
      const known = ["ls","cd","pwd","mkdir","touch","rm","cat","echo","git","pip3","python3","sudo apt","systemctl","uname","whoami","grep","find","history","clear","man","ps aux","df -h","free -h"];
      const match = known.find(c => c.startsWith(linuxInput) && c !== linuxInput);
      if (match) setLinuxInput(match);
    }
  };

  const insertText = (text: string) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const selection = editor.getSelection();
    const id = { major: 1, minor: 1 };
    const op = { identifier: id, range: selection, text, forceMoveMarkers: true };
    editor.executeEdits("my-source", [op]);
    editor.focus();
  };

  const codingShortcuts = [
    { label: "TAB", value: "    " },
    { label: ":", value: ":" },
    { label: "(", value: "(" },
    { label: ")", value: ")" },
    { label: "[", value: "[" },
    { label: "]", value: "]" },
    { label: "{", value: "{" },
    { label: "}", value: "}" },
    { label: "_", value: "_" },
    { label: "\"", value: "\"" },
    { label: "'", value: "'" },
    { label: "=", value: " = " },
    { label: "+", value: " + " },
    { label: "-", value: " - " },
    { label: "*", value: " * " },
    { label: "/", value: " / " },
    { label: "print", value: "print()" },
    { label: "if", value: "if :" },
    { label: "for", value: "for i in range():" },
  ];

  const pyBrainAnalysis = analyzePythonCode(code);
  const lang = LANG_CONFIG[mode];
  const modeTemplates = TEMPLATES[mode];
  const isLinux = mode === "linux";

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem-4rem)] md:h-[calc(100dvh-3.5rem)] flex-col overflow-hidden">
      <Helmet>
        <title>{lang.label} Compiler | PyMaster</title>
        <meta name="description" content={`Run ${lang.label} code in your browser with our professional-grade interactive compiler. No installation required.`} />
        <meta property="og:title" content={`${lang.label} Code Playground`} />
        <meta property="og:description" content="Master coding with real-time feedback and professional tools." />
      </Helmet>

      {/* ---------- PyBrain Dialog ---------- */}
      <Dialog open={isBrainOpen} onOpenChange={setIsBrainOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background/90 backdrop-blur-xl border border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-python-blue">
              <Brain className="w-5 h-5" /> PyBrain Analysis
            </DialogTitle>
            <DialogDescription>AI-driven insights for your current code.</DialogDescription>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-3">
            <div className="text-sm font-medium">Score: <span className={pyBrainAnalysis.score < 70 ? "text-destructive" : pyBrainAnalysis.score < 100 ? "text-python-yellow" : "text-streak-green"}>{pyBrainAnalysis.score}/100</span></div>
            {pyBrainAnalysis.tips.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">Your code looks perfect! No structural tips at this time.</div>
            ) : (
              pyBrainAnalysis.tips.map(tip => (
                <div key={tip.id} className="p-3 rounded-lg border border-white/5 bg-surface-0/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{tip.type}</span>
                    <span className="font-semibold text-sm">{tip.title}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{tip.description}</div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------- Toolbar ---------- */}
      <div className="h-auto min-h-[3rem] bg-surface-1 border-b border-border flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-primary" />

          {/* Language Mode Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowModeMenu(v => !v)}
              aria-label="Change language mode"
              className={`flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1.5 rounded-md bg-secondary border border-border hover:border-primary/40 transition-colors ${lang.color}`}
            >
              <span>{lang.emoji}</span>
              <span className="hidden sm:inline">{lang.label}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            {showModeMenu && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-xl shadow-2xl shadow-black/20 overflow-hidden min-w-[160px]">
                {(Object.entries(LANG_CONFIG) as [LangMode, typeof LANG_CONFIG[LangMode]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => switchMode(key)}
                    className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-secondary ${mode === key ? "bg-secondary font-semibold" : ""} ${cfg.color}`}
                  >
                    <span className="text-base">{cfg.emoji}</span>
                    <span className="text-foreground font-medium">{cfg.label}</span>
                    {mode === key && <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Runtime badge — only for Python/Pandas */}
          {!isLinux && mode !== "sql" && (
            <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${
              runtimeStatus === "ready"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                : runtimeStatus === "error"
                  ? "border-destructive/20 bg-destructive/10 text-destructive"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-600"
            }`}>
              {runtimeStatus === "ready" ? "Ready" : runtimeStatus === "error" ? "Runtime Error" : "Loading..."}
            </span>
          )}
          {mode === "sql" && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600">
              🗄️ SQLite3
            </span>
          )}
          {isLinux && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-500">
              🐧 Sandbox
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Template selector */}
          <select
            className="bg-secondary text-foreground text-xs h-8 px-2 py-1.5 rounded-md border border-border w-full sm:w-auto"
            onChange={(e) => {
              if (isLinux) {
                setLinuxInput(modeTemplates[e.target.value] as string);
                setTimeout(() => linuxInputRef.current?.focus(), 50);
              } else {
                setCode(modeTemplates[e.target.value] as string);
              }
            }}
            defaultValue=""
            key={mode} // reset dropdown when mode changes
          >
            <option value="" disabled>📝 Templates</option>
            {Object.keys(modeTemplates).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          {/* History selector */}
          {history.length > 0 && (
            <select
              className="bg-secondary text-foreground text-xs h-8 px-2 py-1.5 rounded-md border border-border w-full sm:w-auto font-mono"
              onChange={(e) => setCode(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>🕒 History</option>
              {history.map((histCode, i) => (
                <option key={i} value={histCode}>
                  {histCode.split("\n")[0].substring(0, 20) || "Run #" + (history.length - i)}...
                </option>
              ))}
            </select>
          )}


          {/* Clear button */}
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1 flex-1 sm:flex-none" aria-label="Clear code" onClick={() => {
            if (isLinux) {
              setLinuxHistory([{ type: "out", text: "🐧 Terminal cleared. Type a command to start." }]);
            } else {
              setCode(""); setOutput(""); setExecutionTime(null);
            }
          }}>
            <RotateCcw className="w-3 h-3" /> Clear
          </Button>

          {/* PyBrain — only for Python */}
          {(mode === "python" || mode === "pandas") && (
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1 flex-1 sm:flex-none border-python-blue/30 text-python-blue hover:bg-python-blue/10 hover:text-python-blue" aria-label="PyBrain AI analysis" onClick={() => setIsBrainOpen(true)}>
              <Brain className="w-3 h-3" /> PyBrain
            </Button>
          )}

          {/* Run / Stop */}
          {!isLinux && (
            isRunning ? (
              <Button size="sm" variant="destructive" className="h-8 text-xs gap-1 flex-1 sm:flex-none" aria-label="Stop execution" onClick={cancelActivePythonExecution}>
                <Square className="w-3 h-3" /> Stop
              </Button>
            ) : (
              <Button size="sm" className="h-8 text-xs gap-1 flex-1 sm:flex-none" aria-label="Run code" onClick={runCode}>
                <Play className="w-3 h-3" />▶ Run
              </Button>
            )
          )}

          {!isLinux && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1 flex-1 sm:flex-none"
              aria-label="Show editor panel"
              onClick={() => {
                editorPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              📝 Editor
            </Button>
          )}

          {!isLinux && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1 flex-1 sm:flex-none"
              aria-label="Show output panel"
              onClick={() => {
                setActiveTab("output");
                outputPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              📺 Output
            </Button>
          )}

        </div>
      </div>

      {/* Click-away to close mode menu */}
      {showModeMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowModeMenu(false)} />
      )}

      {/* ---------- Main Area ---------- */}
      <div
        ref={containerRef}
        className={`flex-1 flex flex-col ${!isLinux && mode !== "sql" ? "md:flex-row" : "flex-col"} ${
          mode === "sql" ? "overflow-hidden" : "overflow-y-auto md:overflow-hidden"
        } min-h-0`}
      >

        {/* ===== LINUX TERMINAL MODE ===== */}
        {isLinux && (
          <div className="flex-1 flex flex-col bg-[#0d1117] font-mono text-sm overflow-hidden">
            {/* Terminal output */}
            <div
              ref={linuxTermRef}
              className="flex-1 overflow-y-auto p-4 space-y-1"
            >
              {linuxHistory.map((entry, i) => (
                <div key={i} className={entry.type === "in" ? "text-emerald-400" : "text-gray-300"}>
                  {entry.type === "in" ? (
                    <span>
                      <span className="text-blue-400">learner@pymaster</span>
                      <span className="text-white">:</span>
                      <span className="text-cyan-400">~</span>
                      <span className="text-white">$ </span>
                      <span className="text-emerald-300">{entry.text}</span>
                    </span>
                  ) : (
                    <pre className="whitespace-pre-wrap text-gray-300 text-xs sm:text-sm leading-relaxed">{entry.text}</pre>
                  )}
                </div>
              ))}
            </div>
            {/* Input row */}
            <form onSubmit={handleLinuxCommand} className="flex items-center gap-2 border-t border-white/10 px-4 py-3 bg-[#161b22]">
              <span className="text-blue-400 text-xs sm:text-sm shrink-0">
                learner@pymaster:~$
              </span>
              <input
                ref={linuxInputRef}
                type="text"
                value={linuxInput}
                onChange={e => setLinuxInput(e.target.value)}
                onKeyDown={handleLinuxKeyDown}
                className="flex-1 bg-transparent text-emerald-300 text-xs sm:text-sm outline-none placeholder:text-gray-600 font-mono"
                placeholder="Type a command... (↑↓ history, Tab complete)"
                autoComplete="off"
                spellCheck={false}
                autoFocus
              />
              <button type="submit" className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded-md hover:bg-white/5">
                ↵
              </button>
            </form>
          </div>
        )}

        {/* ===== EDITOR MODE (Python / Pandas / SQL) ===== */}
        {!isLinux && (
          <>
            {/* Monaco Editor Panel */}
            <div
              ref={editorPanelRef}
              style={mode === "sql" ? { height: `${sqlSplit}%` } : undefined}
              className={`flex flex-col min-h-0 shrink-0 ${mode === "sql" ? "border-b border-border" : "h-[50vh] md:h-full md:flex-1 border-b md:border-b-0 md:border-r border-border md:shrink"}`}
            >

                <Editor
                  height="100%"
                  language={lang.monacoLang}
                  theme={theme === "dark" ? "vs-dark" : "vs-light"}
                  value={code}
                  onChange={(v) => setCode(v || "")}
                  onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    setIsEditorMounted(true);

                    // Sync SQL autocomplete
                    if (mode === "sql") {
                      monaco.languages.registerCompletionItemProvider("sql", {
                        provideCompletionItems: (model, position) => {
                          const word = model.getWordUntilPosition(position);
                          const range = {
                            startLineNumber: position.lineNumber,
                            endLineNumber: position.lineNumber,
                            startColumn: word.startColumn,
                            endColumn: word.endColumn,
                          };
                          const suggestions = [
                            { label: "customers", kind: monaco.languages.CompletionItemKind.Struct, insertText: "customers", range },
                            { label: "products", kind: monaco.languages.CompletionItemKind.Struct, insertText: "products", range },
                            { label: "orders", kind: monaco.languages.CompletionItemKind.Struct, insertText: "orders", range },
                            { label: "order_items", kind: monaco.languages.CompletionItemKind.Struct, insertText: "order_items", range },
                          ];
                          return { suggestions };
                        },
                      });
                    }

                    // Ctrl+Enter / Cmd+Enter → Run
                    editor.addCommand(
                      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                      () => { if (!isRunning) runCode(); }
                    );

                    // Ctrl+S / Cmd+S → Mock Save
                    editor.addCommand(
                      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                      () => {
                        saveCode(mode, editor.getValue());
                        toast.success("Code saved locally");
                      }
                    );
                  }}
                  loading={
                    <div className="h-full w-full flex flex-col items-center justify-center bg-surface-0 gap-4">
                      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <span className="text-sm font-medium text-muted-foreground animate-pulse">Initializing Editor...</span>
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

              {/* Mobile Coding Shortcut Bar */}
              {isMobile && isEditorMounted && (mode === "python" || mode === "pandas") && (
                <div className="h-10 bg-muted/30 border-t border-border flex items-center overflow-x-auto scrollbar-none px-2 gap-1.5 shrink-0 sticky bottom-0 z-10">
                  {codingShortcuts.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => insertText(item.value)}
                      className="h-7 px-3 flex items-center justify-center bg-background border border-border/60 rounded-md text-[11px] font-mono font-bold text-foreground active:scale-95 active:bg-primary/5 transition-all shrink-0"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SQL Drag Resizer */}
            {mode === "sql" && (
              <div
                onMouseDown={handleResizerMouseDown}
                onTouchStart={handleResizerMouseDown}
                className="shrink-0 h-[6px] flex items-center justify-center cursor-row-resize z-10 group bg-surface-1 hover:bg-primary/20 transition-colors border-y border-border relative select-none"
                title="Drag to resize"
              >
                <div className="flex gap-1">
                  <div className="w-8 h-0.5 rounded-full bg-border group-hover:bg-primary/60 transition-colors" />
                  <div className="w-8 h-0.5 rounded-full bg-border group-hover:bg-primary/60 transition-colors" />
                  <div className="w-8 h-0.5 rounded-full bg-border group-hover:bg-primary/60 transition-colors" />
                </div>
              </div>
            )}

            {/* Output Panel */}
            <div
              ref={outputPanelRef}
              className={`flex flex-col bg-surface-0 min-h-0 ${mode === "sql" ? "flex-1 w-full" : "min-h-[42vh] md:min-h-0 md:h-full md:w-[32rem] md:flex-none shrink-0"}`}
            >
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "output" | "performance")} className="flex flex-col flex-1 min-h-0 bg-surface-0">
                <div className="px-4 py-2 border-b border-border bg-surface-1 flex items-center justify-between shadow-sm shrink-0">
                  <TabsList className="h-8 md:h-6 bg-transparent p-0 gap-4">
                    <TabsTrigger value="output" className="h-8 md:h-6 px-2 text-xs font-mono data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-python-blue data-[state=active]:border-b-2 data-[state=active]:border-python-blue rounded-none">
                      📺 Output
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="h-8 md:h-6 px-2 text-xs font-mono data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-streak-green data-[state=active]:border-b-2 data-[state=active]:border-streak-green rounded-none">
                      ⚡ Performance
                    </TabsTrigger>
                  </TabsList>
                  {executionTime !== null && activeTab === "output" && (
                    <span className="text-[10px] text-muted-foreground mr-2">⏱ {executionTime}ms</span>
                  )}
                </div>

                <TabsContent value="output" className="flex-1 m-0 p-0 overflow-hidden focus-visible:outline-none">
                  <div className="h-full flex flex-col overflow-hidden">
                  {/* SQL Schema Reference Strip */}
                  {mode === "sql" && (
                    <div className="shrink-0 border-b border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                      <div className="text-[10px] font-semibold text-emerald-500 mb-1">🗄️ ShopDB — Available Tables</div>
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">customers(id, name, city, signup_date)</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">products(id, name, category, price)</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">orders(id, customer_id, order_date, status)</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">order_items(order_id, product_id, quantity)</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">product_reviews(id, product_id, customer_id, rating, review_text)</span>
                      </div>
                    </div>
                  )}

                  {isRunning ? (
                    <div className="flex-1 p-4 animate-pulse text-[13px] sm:text-sm font-mono text-muted-foreground">
                      {mode === "sql"
                        ? "⏳ Running SQL query..."
                        : mode === "pandas"
                          ? "🐼 Loading Pandas from CDN...\nThis takes 20–60s on first run. Please wait.\nSubsequent runs will be instant."
                          : runtimeStatus === "ready"
                            ? "⏳ Running code in browser..."
                            : "⏳ Loading Python runtime..."}
                    </div>
                  ) : (
                    (mode === "sql" && output && !output.includes("❌") && output.includes(",")) ? (
                      <SqlTableView csvOutput={output} />
                    ) : (
                      <pre className={`flex-1 p-4 text-[13px] sm:text-sm font-mono overflow-auto whitespace-pre-wrap ${
                        output.includes("❌") || output.includes("⚠️") ? "text-destructive" : output.startsWith("⏳") ? "text-amber-400" : "text-foreground"
                      }`}>
                        {output ||
                          (runtimeStatus === "error" && mode !== "sql"
                            ? `❌ Runtime failed to load.\n${runtimeError || "Please refresh and try again."}`
                            : `Click '▶ Run' to execute your ${lang.label} code.\nRuns in an isolated browser environment${mode !== "sql" ? ` with a ${timeoutSeconds}s timeout` : ""}.`)}
                      </pre>
                    )
                  )}
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="flex-1 m-0 p-0 overflow-hidden focus-visible:outline-none">
                  <div className="h-full flex flex-col overflow-hidden p-4">
                  {executionHistory.length > 0 ? (
                    <div className="flex-1 min-h-0 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={executionHistory} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                          <XAxis dataKey="runId" stroke="#888" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}ms`} />
                          <RechartsTooltip
                            contentStyle={{ backgroundColor: '#1a1b26', borderColor: '#2f3146', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#4ade80' }}
                            formatter={(value: number) => [`${value} ms`, 'Execution Time']}
                            labelStyle={{ color: '#888' }}
                            labelFormatter={(label) => `Run #${label}`}
                          />
                          <Line type="monotone" dataKey="time" stroke="#4ade80" strokeWidth={3} dot={{ r: 4, fill: '#1a1b26', stroke: '#4ade80', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#4ade80', stroke: '#fff' }} animationDuration={1000} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm flex-col gap-2">
                      <span className="text-2xl">⚡</span>
                      Run code to see performance tracking
                    </div>
                  )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
