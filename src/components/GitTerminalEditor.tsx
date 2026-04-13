import React, { useState, useRef, useEffect, useMemo } from "react";
import { Check, Lock, Terminal as TerminalIcon, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/contexts/ProgressContext";
import { useToast } from "@/components/ui/use-toast";
import { Exercise } from "@/data/lessons";
import { GitSimulator } from "@/lib/gitSimulator";

interface GitTerminalEditorProps {
  exercise: Exercise;
  level: "beginner" | "intermediate" | "advanced";
  lessonId: string;
  locked: boolean;
}

export function GitTerminalEditor({ exercise, level, lessonId, locked }: GitTerminalEditorProps) {
  const { progress, completeExercise, addWallet } = useProgress();
  const { toast } = useToast();
  
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ type: "in" | "out" | "sys"; text: string }[]>([
    { type: "sys", text: "Welcome to PyMaster Git Terminal. Type your commands below." }
  ]);
  const [solutionUnlocked, setSolutionUnlocked] = useState(false);
  
  const simulator = useMemo(() => new GitSimulator(), []);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const passedId = `${lessonId}:${level}`;
  const passed = progress.completedExercises.includes(passedId);
  const isCorrectCommand = (cmd: string) => cmd.trim() === exercise.expectedOutput?.trim();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || locked) return;

    const cmd = input.trim();
    setInput("");

    const newHistory = [...history, { type: "in", text: `$ ${cmd}` } as const];
    
    // Check if right command
    const isCorrect = isCorrectCommand(cmd);

    const output = simulator.executeCommand(cmd);
    
    let finalHistory = [...newHistory];

    if (output === "CLEAR_TERMINAL") {
      finalHistory = [];
    } else if (output) {
      finalHistory.push({ type: "out", text: output });
    }

    if (isCorrect && !passed) {
      completeExercise(`${lessonId}:${level}`);
      finalHistory.push({ type: "sys", text: `✅ Success! You completed the ${level} exercise. +20 coins!` });
      toast({
        title: "Exercise Passed! 🎉",
        description: `You've mastered the ${level} objective.`,
      });
      addWallet(20);
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

    if (progress.wallet >= 70) {
      addWallet(-70);
      setSolutionUnlocked(true);
      toast({
        title: "Solution Unlocked!",
        description: `70 coins deducted. Run this command: ${exercise.expectedOutput}`,
      });
    } else {
      toast({
        title: "Insufficient Coins",
        description: "You need 70 coins to unlock the solution.",
        variant: "destructive",
      });
    }
  };

  if (locked) {
    return (
      <div className="border border-border rounded-lg p-5 bg-card/50 opacity-60 flex flex-col items-center justify-center text-center">
        <Lock className="w-8 h-8 text-muted-foreground mb-3" />
        <h4 className="font-semibold text-foreground capitalize mb-1">{level} Exercise</h4>
        <p className="text-sm text-muted-foreground">Complete previous exercises to unlock.</p>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg overflow-hidden transition-all duration-300 ${passed ? "border-streak-green/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "border-border"}`}>
      {/* Header */}
      <div className="bg-surface-1 px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          {passed ? <Check className="w-4 h-4 text-streak-green" /> : <TerminalIcon className="w-4 h-4 text-expert-purple" />}
          <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <span className="capitalize">{level} Challenge</span>
            {passed && <span className="text-xs font-normal text-streak-green bg-streak-green/10 px-2 py-0.5 rounded-full">Completed</span>}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {!passed && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 border-reward-gold/30 text-reward-gold hover:bg-reward-gold/10"
              onClick={handleRevealSolution}
            >
              <Key className="w-3 h-3" />
              {solutionUnlocked ? "Show Solution" : "Reveal Solution ($70)"}
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 bg-card">
        <div className="mb-4 text-sm text-foreground">
          <p className="font-medium text-foreground mb-1">Task:</p>
          <p className="text-muted-foreground leading-relaxed">{exercise.prompt}</p>
        </div>

        <div className="rounded-lg border border-border bg-[#0d1117] overflow-hidden flex flex-col font-mono text-sm shadow-inner" style={{ height: "250px" }}>
          {/* Terminal content */}
          <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-2 text-[#e6edf3]">
            {history.map((line, idx) => (
              <div key={idx} className={
                line.type === "sys" ? "text-streak-green opacity-80 italic" : 
                line.type === "in" ? "text-reward-gold" : "text-[#8b949e] whitespace-pre-wrap"
              }>
                {line.text}
              </div>
            ))}
          </div>
          
          {/* Terminal Input */}
          <form onSubmit={handleCommand} className="flex items-center bg-[#0d1117] px-4 py-3 border-t border-border/40">
            <span className="text-streak-green mr-2 font-bold">~</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-[#e6edf3] outline-none placeholder:text-[#8b949e] placeholder:opacity-50"
              placeholder="Enter git command..."
              autoComplete="off"
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
}
