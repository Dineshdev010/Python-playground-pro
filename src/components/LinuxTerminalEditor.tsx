import React, { useState, useRef, useEffect, useMemo } from "react";
import { Check, Lock, Terminal as TerminalIcon, Key, ChevronRight } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import { useToast } from "@/hooks/use-toast";
import { GitSimulator } from "@/lib/gitSimulator";
import { motion } from "framer-motion";

interface LinuxTerminalEditorProps {
  exercise: {
    prompt: string;
    starterCode?: string;
    expectedOutput?: string;
  };
  level: "beginner" | "intermediate" | "advanced";
  lessonId: string;
  locked: boolean;
  onComplete?: () => void;
}

export function LinuxTerminalEditor({ exercise, level, lessonId, locked, onComplete }: LinuxTerminalEditorProps) {
  const { progress, completeExercise, addWallet } = useProgress();
  const { toast } = useToast();
  
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ type: "in" | "out" | "sys"; text: string }[]>([
    { type: "sys", text: "Welcome to PyMaster Linux Terminal — user@pymaster:~$" }
  ]);
  const [solutionUnlocked, setSolutionUnlocked] = useState(false);
  
  const simulator = useMemo(() => new GitSimulator(), []);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const passedId = `${lessonId}:${level}`;
  const passed = progress.completedExercises.includes(passedId);
  const isCorrectCommand = (cmd: string) => {
    if (!exercise.expectedOutput) return true;
    const cleanCmd = cmd.trim().toLowerCase();
    const cleanExpected = exercise.expectedOutput.trim().toLowerCase();
    
    // Exact match or contains (for more flexibility in linux commands)
    return cleanCmd === cleanExpected || cleanCmd.startsWith(cleanExpected);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Command history persistence within session
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIdx = historyIdx + 1;
      if (nextIdx < cmdHistory.length) {
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = historyIdx - 1;
      if (nextIdx >= 0) {
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else {
        setHistoryIdx(-1);
        setInput("");
      }
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || locked) return;

    const cmd = input.trim();
    setInput("");
    setHistoryIdx(-1);
    setCmdHistory(prev => [...prev, cmd]);

    const newHistory = [...history, { type: "in", text: `user@pymaster:~$ ${cmd}` } as const];
    
    const isCorrect = isCorrectCommand(cmd);
    const output = simulator.executeCommand(cmd);
    
    let finalHistory = [...newHistory];

    if (output === "CLEAR_TERMINAL") {
      finalHistory = [{ type: "sys", text: "user@pymaster:~$" }];
    } else if (output) {
      finalHistory.push({ type: "out", text: output });
    } else if (!output && cmd) {
       // Optional: add a generic output if none returned and it wasn't clear
    }

    if (isCorrect && !passed) {
      completeExercise(`${lessonId}:${level}`);
      finalHistory.push({ type: "sys", text: `✅ [SUCCESS] Objective met. +25 cash added.` });
      toast({
        title: "Objective Complete!",
        description: `You've mastered the ${level} task.`,
      });
      addWallet(25);
      if (onComplete) onComplete();
    }

    setHistory(finalHistory);
  };

  const handleRevealSolution = () => {
    if (solutionUnlocked) {
      toast({
        title: "Solution",
        description: `Run this command: ${exercise.expectedOutput}`,
      });
      return;
    }

    if (progress.wallet >= 50) {
      addWallet(-50);
      setSolutionUnlocked(true);
      toast({
        title: "Solution Unlocked!",
        description: `50 cash deducted. Run this command: ${exercise.expectedOutput}`,
      });
    } else {
      toast({
        title: "Insufficient Cash",
        description: "You need 50 cash to unlock this hint.",
        variant: "destructive",
      });
    }
  };

  if (locked) {
    return (
      <div className="border border-white/5 rounded-xl p-6 bg-black/40 backdrop-blur-sm opacity-50 flex flex-col items-center justify-center text-center">
        <Lock className="w-8 h-8 text-muted-foreground/40 mb-3" />
        <h4 className="font-semibold text-muted-foreground/60 capitalize mb-1">{level} Task</h4>
        <p className="text-xs text-muted-foreground/40">Complete the previous stage to unlock this terminal session.</p>
      </div>
    );
  }

  return (
    <div className={`group border rounded-xl overflow-hidden transition-all duration-500 bg-black/60 backdrop-blur-md ${passed ? "border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]" : "border-white/10 shadow-2xl"}`}>
      {/* Terminal Window Header */}
      <div className="bg-white/[0.03] px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <TerminalIcon className={`w-3.5 h-3.5 ${passed ? "text-emerald-400" : "text-primary/60"}`} />
            <span className="text-[11px] font-mono text-white/40 font-medium tracking-wider uppercase">
              {level}_session.sh {passed && "— COMPLETE"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!passed && exercise.expectedOutput && (
            <button
              onClick={handleRevealSolution}
              className="text-[10px] font-mono text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5"
            >
              <Key className="w-3 h-3" />
              {solutionUnlocked ? "Show Solution" : "Unlock Hint ($50)"}
            </button>
          )}
        </div>
      </div>

      <div className="p-0">
        {/* Task Description (Integrated into Terminal feel) */}
        <div className="px-5 py-4 border-b border-white/5 bg-emerald-500/[0.02]">
          <div className="flex items-start gap-3">
            <div className={`mt-1 h-2 w-2 rounded-full ${passed ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-primary animate-pulse"}`} />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1.5">Mission Objective</h4>
              <p className="text-sm text-white/80 leading-relaxed font-mono italic">
                {exercise.prompt}
              </p>
            </div>
          </div>
        </div>

        <div className="relative font-mono text-[13px] h-[320px] flex flex-col">
          {/* Terminal content */}
          <div 
            ref={containerRef} 
            className="flex-1 overflow-y-auto p-5 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent custom-terminal-glow"
          >
            {history.map((line, idx) => (
              <div key={idx} className={
                line.type === "sys" ? "text-emerald-400/90 font-bold" : 
                line.type === "in" ? "text-white/90" : "text-white/60 whitespace-pre-wrap leading-relaxed"
              }>
                {line.text}
              </div>
            ))}
            {passed && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2 text-emerald-500 font-bold flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> [PROCESS_COMPLETE]: READY_FOR_NEXT_STATION
              </motion.div>
            )}
          </div>
          
          {/* Terminal Input */}
          <form 
            onSubmit={handleCommand} 
            className="flex items-center bg-white/[0.02] px-5 py-3 border-t border-white/5"
          >
            <div className="flex items-center gap-2 mr-3 shrink-0">
              <span className="text-emerald-400 font-bold">user</span>
              <span className="text-white/40">@</span>
              <span className="text-primary font-bold">pymaster</span>
              <span className="text-white/40">:</span>
              <span className="text-amber-400 font-bold">~</span>
              <span className="text-emerald-400 font-bold">$</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white/90 outline-none caret-emerald-500"
              placeholder={passed ? "Objective complete..." : "Type command..."}
              disabled={passed || locked}
              autoComplete="off"
              autoFocus
            />
            {!passed && (
              <button 
                type="submit"
                className="ml-2 hover:text-emerald-400 transition-colors text-white/20"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      <style>{`
        .custom-terminal-glow {
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.05);
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
