import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Code2, GripVertical, Play, Trash2, CheckCircle2, XCircle, Info, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSound } from "@/contexts/SoundContext";
import { executePython } from "@/lib/piston";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type Block = {
  id: string;
  label: string;
  snippet: string;
};

type Challenge = {
  id: string;
  title: string;
  task: string;
  targetOutput: string;
  hint: string;
};

type Topic = {
  id: string;
  title: string;
  description: string;
  color: string;
  blocks: Block[];
  challenges: Challenge[];
};

type DroppedBlock = {
  instanceId: string;
  blockId: string;
};

const topics: Topic[] = [
  {
    id: "hello-basics",
    title: "Hello Python",
    description: "Start with greeting, comments, and simple print statements.",
    color: "blue",
    blocks: [
      { id: "hello", label: 'Print "Hello!"', snippet: 'print("Hello!")' },
      { id: "name", label: "name = 'Code'", snippet: 'name = "Code"' },
      { id: "welcome", label: "Print welcome", snippet: 'print(f"Welcome, {name}")' },
      { id: "comment", label: "Add comment", snippet: "# My Script" },
    ],
    challenges: [
      {
        id: "greet",
        title: "The First Greeting",
        task: "Drag blocks to print 'Hello!' to the console.",
        targetOutput: "Hello!",
        hint: "Use the 'Print Hello!' block."
      },
      {
        id: "named-welcome",
        title: "Personal Touch",
        task: "Create a variable 'name' and print 'Welcome, Code'.",
        targetOutput: "Welcome, Code",
        hint: "You need both the name assignment and the welcome print blocks."
      }
    ]
  },
  {
    id: "variables",
    title: "Variables",
    description: "Master data types and dynamic assignment.",
    color: "amber",
    blocks: [
      { id: "age", label: "age = 25", snippet: "age = 25" },
      { id: "inc", label: "age += 5", snippet: "age += 5" },
      { id: "print-age", label: "Print age", snippet: "print(age)" },
      { id: "str-age", label: "Print type", snippet: "print(type(age))" },
    ],
    challenges: [
      {
        id: "math",
        title: "Aging Fast",
        task: "Set age to 25, add 5 to it, then print the final age.",
        targetOutput: "30",
        hint: "Order matters: set age, increment it, THEN print it."
      }
    ]
  },
  {
    id: "conditionals",
    title: "Decisions",
    description: "Build if-elif-else logic for your programs.",
    color: "rose",
    blocks: [
      { id: "score", label: "score = 85", snippet: "score = 85" },
      { id: "if-pass", label: "Check Pass", snippet: "if score >= 50:\n    print('Pass')\nelse:\n    print('Fail')" },
      { id: "print-score", label: "Print score", snippet: "print(f'Score: {score}')" },
    ],
    challenges: [
      {
        id: "logic",
        title: "Pass or Fail",
        task: "Define a score of 85 and print whether it is a 'Pass' or 'Fail'.",
        targetOutput: "Pass",
        hint: "The conditional block already handles the logic; just set the score first."
      }
    ]
  },
  {
    id: "loops",
    title: "Loops",
    description: "Repeat actions efficiently.",
    color: "emerald",
    blocks: [
      { id: "for", label: "Loop 1 to 3", snippet: "for i in range(1, 4):\n    print(i)" },
      { id: "while", label: "While count < 2", snippet: "c = 0\nwhile c < 2:\n    print('Go')\n    c += 1" },
    ],
    challenges: [
      {
        id: "count",
        title: "Countdown",
        task: "Execute a loop that prints numbers 1, 2, and 3.",
        targetOutput: "1\n2\n3",
        hint: "The 'Loop 1 to 3' block is perfect for this."
      }
    ]
  },
  {
    id: "lists",
    title: "Lists",
    description: "Store collections of data.",
    color: "indigo",
    blocks: [
      { id: "list", label: "items = ['🍎']", snippet: "items = ['🍎']" },
      { id: "add", label: "Add '🍌'", snippet: "items.append('🍌')" },
      { id: "show", label: "Print items", snippet: "print(items)" },
    ],
    challenges: [
      {
        id: "fruit",
        title: "Fruit Basket",
        task: "Create a list with an apple, add a banana, and print the list.",
        targetOutput: "['🍎', '🍌']",
        hint: "Initialize the list first, then append to it."
      }
    ]
  }
];

function getBlockById(topic: Topic, blockId: string) {
  return topic.blocks.find((block) => block.id === blockId);
}

export default function PythonGamePage() {
  const { playSound } = useSound();
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0].id);
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [droppedByTopic, setDroppedByTopic] = useState<Record<string, DroppedBlock[]>>(
    Object.fromEntries(topics.map((topic) => [topic.id, []])),
  );
  
  // Game state
  const [executionOutput, setExecutionOutput] = useState("");
  const [executionError, setExecutionError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [gameStatus, setGameStatus] = useState<"idle" | "success" | "failure">("idle");
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) || topics[0];
  const currentChallenge = selectedTopic.challenges[currentChallengeIdx] || selectedTopic.challenges[0];
  const dropped = useMemo(() => droppedByTopic[selectedTopic.id] || [], [droppedByTopic, selectedTopic.id]);


  const generatedCode = useMemo(() => {
    const snippets = dropped
      .map((entry) => getBlockById(selectedTopic, entry.blockId)?.snippet)
      .filter((snippet): snippet is string => Boolean(snippet));

    if (snippets.length === 0) {
      return '# Drag blocks into the canvas to build Python code\nprint("Hello Python")';
    }

    return snippets.join("\n\n");
  }, [dropped, selectedTopic]);

  const handleDropBlock = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const blockId = event.dataTransfer.getData("text/plain");
    if (!blockId) return;

    const block = getBlockById(selectedTopic, blockId);
    if (!block) return;

    const newEntry: DroppedBlock = {
      instanceId: `${blockId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      blockId: block.id,
    };

    setDroppedByTopic((current) => ({
      ...current,
      [selectedTopic.id]: [...(current[selectedTopic.id] || []), newEntry],
    }));
    playSound("drop");
  };

  const removeDropped = (instanceId: string) => {
    setDroppedByTopic((current) => ({
      ...current,
      [selectedTopic.id]: (current[selectedTopic.id] || []).filter((entry) => entry.instanceId !== instanceId),
    }));
    playSound("error");
  };

  const clearCanvas = () => {
    setDroppedByTopic((current) => ({
      ...current,
      [selectedTopic.id]: [],
    }));
    setExecutionOutput("");
    setExecutionError("");
    setGameStatus("idle");
    playSound("success");
  };

  const handleRunCode = async () => {
    if (dropped.length === 0) {
      setExecutionError("Drag some blocks first!");
      return;
    }

    setIsRunning(true);
    setGameStatus("idle");
    setExecutionOutput("");
    setExecutionError("");
    playSound("click");

    try {
      const result = await executePython(generatedCode);
      const output = result.output.trim();
      const error = result.error.trim();

      setExecutionOutput(output);
      setExecutionError(error);

      if (error) {
        setGameStatus("failure");
        playSound("error");
      } else {
        checkSolution(output);
      }
    } catch {
      setExecutionError("Execution failed. Check your logic!");
      setGameStatus("failure");
      playSound("error");
    } finally {
      setIsRunning(false);
    }
  };

  const checkSolution = (actualOutput: string) => {
    const target = currentChallenge.targetOutput.trim();
    
    if (actualOutput === target) {
      setGameStatus("success");
      playSound("success");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981", "#f59e0b"]
      });
      
      const cid = `${selectedTopic.id}-${currentChallenge.id}`;
      setCompletedChallenges(prev => {
        const next = new Set(prev);
        next.add(cid);
        return next;
      });
    } else {
      setGameStatus("failure");
      playSound("error");
    }
  };

  const nextChallenge = () => {
    if (currentChallengeIdx < selectedTopic.challenges.length - 1) {
      setCurrentChallengeIdx(prev => prev + 1);
      setGameStatus("idle");
      setExecutionOutput("");
      setExecutionError("");
    } else {
      // Find next topic
      const currentTopicIdx = topics.findIndex(t => t.id === selectedTopic.id);
      if (currentTopicIdx < topics.length - 1) {
        setSelectedTopicId(topics[currentTopicIdx + 1].id);
        setCurrentChallengeIdx(0);
        setGameStatus("idle");
        setExecutionOutput("");
      }
    }
  };

  const totalChallenges = topics.reduce((acc, t) => acc + t.challenges.length, 0);
  const progressPercent = (completedChallenges.size / totalChallenges) * 100;

  return (
    <div className="min-h-screen bg-[#0b1020] text-slate-100 overflow-x-hidden selection:bg-primary/30">
      <Helmet>
        <title>Python Puzzle Arena | PyMaster</title>
        <meta name="description" content="Master Python logic in our interactive code blocks game." />
      </Helmet>

      {/* --- PREMIUM HEADER & PROGRESS --- */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-[#0b1020]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-lg shadow-primary/10">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">Python Puzzle Arena</h1>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400">
                  <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-amber-400" /> Mastery Mode</span>
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  <span>Challenge {completedChallenges.size + 1} of {totalChallenges}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden w-48 space-y-1.5 md:block">
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>OVERALL PROGRESS</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-1.5 bg-white/5" indicatorClassName="bg-gradient-to-r from-primary to-indigo-400" />
              </div>

              <div className="flex -space-x-2">
                {topics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTopicId(t.id);
                      setCurrentChallengeIdx(0);
                    }}
                    title={t.title}
                    className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                      selectedTopicId === t.id 
                        ? "border-primary bg-primary/20 scale-110 z-10" 
                        : "border-white/5 bg-slate-900 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                    }`}
                  >
                     <div className={`h-full w-full rounded-full bg-${t.color}-500/20 flex items-center justify-center text-[10px]`}>
                        {t.title[0]}
                     </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
        <div className="grid h-full gap-6 lg:grid-cols-[340px_1fr_380px]">
          
          {/* --- COLUMN 1: CHALLENGE CARD --- */}
          <section className="flex flex-col gap-6">
            <motion.div 
              key={currentChallenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group relative rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-sm overflow-hidden"
            >
              <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-${selectedTopic.color}-500/10 blur-3xl`} />
              
              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-lg bg-${selectedTopic.color}-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-${selectedTopic.color}-400 ring-1 ring-${selectedTopic.color}-500/20`}>
                    {selectedTopic.title}
                  </span>
                  {completedChallenges.has(`${selectedTopic.id}-${currentChallenge.id}`) && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 animate-in fade-in zoom-in" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold text-white">{currentChallenge.title}</h2>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {currentChallenge.task}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/40 p-4 border border-white/[0.03]">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    <Info className="h-3 w-3" /> Target Output
                  </div>
                  <pre className="text-sm font-mono text-emerald-400/90 whitespace-pre-wrap">
                    {currentChallenge.targetOutput}
                  </pre>
                </div>

                <div className="flex flex-col gap-2">
                   <button 
                    onClick={() => toast(`Hint: ${currentChallenge.hint}`, { icon: '💡' })}
                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-primary transition-colors font-medium underline underline-offset-4 decoration-white/10"
                   >
                    Stuck? View a hint
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-5 space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase">Available Logic</h3>
              <div className="grid grid-cols-1 gap-2.5">
                {selectedTopic.blocks.map((block) => (
                  <motion.div
                    key={block.id}
                    draggable
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onDragStart={(event: any) => {
                      event.dataTransfer.setData("text/plain", block.id);
                      playSound("click");
                    }}
                    className="flex cursor-grab items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 hover:bg-white/[0.08] hover:border-white/10 active:cursor-grabbing transition-all ring-1 ring-inset ring-white/[0.02]"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-500 group-hover:text-primary">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-200">{block.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* --- COLUMN 2: WORKSHOP (ARENA) --- */}
          <section className="flex flex-col gap-4">
            <div
              className={`relative flex-1 rounded-[2.5rem] border-2 border-dashed transition-all duration-300 min-h-[500px] flex flex-col ${
                dropped.length === 0 
                  ? "border-white/10 bg-slate-900/20" 
                  : "border-primary/20 bg-slate-900/40"
              }`}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDropBlock}
            >
              {/* CANVAS HEADER */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Workshop Arena</span>
                </div>
                <div className="flex items-center gap-3">
                   <Button variant="ghost" size="sm" onClick={clearCanvas} className="h-8 text-slate-500 hover:text-red-400">
                    <Trash2 className="h-4 w-4 mr-1.5" /> Clear
                  </Button>
                </div>
              </div>

              {/* DROP AREA */}
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {dropped.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="flex h-full flex-col items-center justify-center text-center space-y-4"
                    >
                      <div className="rounded-full bg-slate-800/50 p-6 border border-white/5">
                        <GripVertical className="h-10 w-10 text-slate-600" />
                      </div>
                      <div className="max-w-[240px] space-y-1">
                        <p className="text-sm font-semibold text-slate-300">Start Building...</p>
                        <p className="text-xs text-slate-500">Drag blocks from the left panel and drop them here to compose your script.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {dropped.map((entry, index) => {
                        const block = getBlockById(selectedTopic, entry.blockId);
                        if (!block) return null;
                        
                        return (
                          <motion.div
                            key={entry.instanceId}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="group relative flex items-center justify-between rounded-2xl border border-white/5 bg-slate-800/40 px-5 py-3 shadow-sm hover:border-primary/30 hover:bg-slate-800/60 transition-all ring-1 ring-white/[0.02]"
                          >
                            <div className="flex items-center gap-4">
                              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[10px] font-bold text-slate-600">
                                {index + 1}
                              </span>
                              <div className="font-mono text-sm text-slate-200">
                                {block.label}
                              </div>
                            </div>
                            <button
                              onClick={() => removeDropped(entry.instanceId)}
                              className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* ACTION BUTTON */}
              <div className="p-8 mt-auto">
                 <button 
                  onClick={handleRunCode}
                  disabled={isRunning || dropped.length === 0}
                  className={`group relative w-full h-14 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${
                    isRunning || dropped.length === 0
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] hover:bg-primary/90"
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isRunning ? (
                      <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Play className="h-5 w-5 transition-transform group-hover:rotate-12" />
                    )}
                    <span>{isRunning ? "Executing..." : "Compile & Verify"}</span>
                  </div>
                </button>
              </div>
            </div>
          </section>

          {/* --- COLUMN 3: TERMINAL & FEEDBACK --- */}
          <section className="flex flex-col gap-6">
             <div className="flex-1 flex flex-col rounded-3xl border border-white/10 bg-slate-950 shadow-2xl overflow-hidden ring-1 ring-inset ring-white/[0.05]">
                <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.02] border-b border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="ml-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Live Console</span>
                  </div>
                   <Code2 className="h-4 w-4 text-slate-700" />
                </div>

                <div className="flex-1 p-6 font-mono text-sm overflow-auto custom-scrollbar-dark bg-[#0d1221]">
                   <AnimatePresence mode="wait">
                      {executionOutput || executionError ? (
                        <motion.div
                          key="output"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-3"
                        >
                          {executionOutput && (
                             <div className="text-emerald-400">
                               <span className="text-slate-600 mr-2">❯</span> 
                               {executionOutput}
                             </div>
                          )}
                          {executionError && (
                             <div className="text-rose-400 bg-rose-500/5 p-3 rounded-lg border border-rose-500/10">
                               <span className="font-bold flex items-center gap-2 mb-1"><XCircle className="h-3 w-3" /> Error:</span>
                               {executionError}
                             </div>
                          )}
                        </motion.div>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-slate-700 select-none">
                           <Play className="h-12 w-12 mb-4 opacity-10" />
                           <p className="text-xs italic">Waiting for execution...</p>
                        </div>
                      )}
                   </AnimatePresence>
                </div>

                <div className="p-6 border-t border-white/[0.05] bg-white/[0.01] space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Verification</span>
                     <div className={`h-2 w-2 rounded-full ${
                        gameStatus === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 
                        gameStatus === 'failure' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 
                        'bg-slate-700'
                     }`} />
                  </div>

                  <AnimatePresence mode="wait">
                    {gameStatus === 'success' ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center"
                      >
                         <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center justify-center gap-2">
                           <CheckCircle2 className="h-4 w-4" /> Challenge Complete!
                         </h4>
                         <p className="text-xs text-emerald-400/70 mb-4">You successfully matched the target output.</p>
                         <Button onClick={nextChallenge} className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold">
                           Next Challenge
                         </Button>
                      </motion.div>
                    ) : gameStatus === 'failure' ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center"
                      >
                         <h4 className="text-sm font-bold text-rose-400 mb-2 flex items-center justify-center gap-2">
                           <XCircle className="h-4 w-4" /> Logic Mismatch
                         </h4>
                         <p className="text-xs text-rose-400/70">The output didn&apos;t match the target. Try reordering or checking your blocks!</p>
                      </motion.div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center italic text-xs text-slate-500">
                        Solve the puzzle to unlock the next level
                      </div>
                    )}
                  </AnimatePresence>
                </div>
             </div>

             <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-5">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase">Live Code Preview</h3>
               </div>
               <div className="rounded-xl overflow-hidden bg-black/40 ring-1 ring-white/10">
                  <pre className="p-4 text-[11px] font-mono text-slate-400 overflow-x-auto selection:bg-primary/40">
                    <code>{generatedCode}</code>
                  </pre>
               </div>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
}
