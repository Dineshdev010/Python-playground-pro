import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb, Heart, Sparkles } from "lucide-react";
import { pythonTips, PythonTip } from "@/data/pythonTips";
import gpayQR from "@/assets/gpay-qr.jpg";

export const SUPPORT_TIP_EVENT = "pymaster-show-support-tip";

export function SupportTipPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState<PythonTip | null>(null);
  const [progress, setProgress] = useState(100);
  const DURATION = 30000; // 30 seconds

  const showPopup = useCallback(() => {
    const randomTip = pythonTips[Math.floor(Math.random() * pythonTips.length)];
    setCurrentTip(randomTip);
    setIsVisible(true);
    setProgress(100);
  }, []);

  useEffect(() => {
    const handleTrigger = () => showPopup();
    window.addEventListener(SUPPORT_TIP_EVENT, handleTrigger);
    return () => window.removeEventListener(SUPPORT_TIP_EVENT, handleTrigger);
  }, [showPopup]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(remaining);

      if (elapsed >= DURATION) {
        setIsVisible(false);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && currentTip && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
          className="fixed bottom-4 left-3 right-3 z-[1000] w-auto sm:bottom-6 sm:left-auto sm:right-6 sm:w-[320px] overflow-hidden rounded-2xl border border-primary/20 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10"
        >
          {/* Header */}
          <div className="relative h-24 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-python-yellow/10 p-4">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Sparkles className="h-20 w-20 text-primary" />
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-2 top-2 rounded-full bg-background/50 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <div className="rounded-full bg-primary/20 p-1.5">
                <Lightbulb className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Python Pro Tip</span>
            </div>
            <h4 className="text-sm font-bold text-foreground leading-tight">{currentTip.title}</h4>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {currentTip.content}
            </p>
            
            {currentTip.code && (
              <pre className="rounded-lg bg-surface-1 p-2.5 text-[10px] font-mono text-foreground border border-border/50 overflow-x-auto">
                <code>{currentTip.code}</code>
              </pre>
            )}

            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Heart className="h-3 w-3 text-destructive fill-destructive" />
                    <span className="text-[10px] font-bold text-foreground">Support PyMaster</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground leading-snug">
                    Your support keeps the platform free for everyone! Scan to donate via UPI.
                  </p>
                </div>
                <div className="relative group shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-python-yellow rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <img 
                    src={gpayQR} 
                    alt="Support QR" 
                    className="relative h-16 w-16 rounded-lg border border-border shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar Timer */}
          <div className="h-1 w-full bg-secondary/50">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-python-yellow"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
