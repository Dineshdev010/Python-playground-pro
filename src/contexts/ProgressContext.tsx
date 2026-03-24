// ============================================================
// PROGRESS CONTEXT — src/contexts/ProgressContext.tsx
// The "brain" of the reward system. Manages all user progress:
// - Solved problems, completed lessons, exercises
// - Wallet (virtual currency), XP, streaks
// - Celebration modals for milestones
// - Star catching from the landing page
// ============================================================

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  UserProgress,
  getProgress,
  saveProgress,
  recordActivity,
  getRewardForDifficulty,
  canRecoverStreak,
  recoverStreak,
  getStreakRecoveryCost,
  mergeProgress,
  profileRowToProgress,
  progressToProfileUpdate,
} from "@/lib/progress";
import { playCelebrationSound, playApplauseSound, playLevelUpSound } from "@/lib/sounds";
import { getEarnedBadges } from "@/lib/badges";
import { problems } from "@/data/problems";
import confetti from "canvas-confetti";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

// ---------- TypeScript interface for the context ----------
// Every function and value that child components can access
interface ProgressContextType {
  progress: UserProgress;                // Current user progress object
  solveProblem: (problemId: string, difficulty: string) => void;  // Mark a problem as solved
  completeLesson: (lessonId: string) => void;   // Mark a lesson as completed
  completeExercise: (exerciseKey: string) => void; // Mark an exercise as completed
  logActivity: () => void;               // Record daily activity (for streak)
  catchStar: (xpGain: number) => void;   // Catch a shooting star for XP
  addDailyStar: () => void;              // Catch a GTA-style daily task star
  unlockLesson: (lessonId: string, cost?: number) => boolean;   // Unlock a lesson, optionally charging wallet
  attemptStreakRecovery: () => boolean;   // Try to restore a broken streak
  addWallet: (amount: number) => void;   // Add/subtract from wallet
  addTimeSpent: (seconds: number) => void; // Add time spent learning
  canRecover: boolean;                   // Whether streak recovery is available
  recoveryCost: number;                  // Cost to recover the streak
  showCelebration: boolean;              // Whether to show the celebration modal
  celebrationData: { title: string; subtitle: string; emoji: string; reward?: string } | null;
  dismissCelebration: () => void;        // Close the celebration modal
}

// Create the context (null by default — must be inside Provider)
const ProgressContext = createContext<ProgressContextType | null>(null);

// ---------- Streak milestone definitions ----------
// When user hits these streak days, they get a celebration + bonus cash
const STREAK_MILESTONES: Record<7 | 14 | 30 | 100, { title: string; subtitle: string; emoji: string; reward: string }> = {
  7: { title: "🔥 1 Week Streak!", subtitle: "You've coded for 7 days straight! You're building a habit!", emoji: "🔥", reward: "+$10 bonus" },
  14: { title: "⚡ 2 Week Warrior!", subtitle: "14 days of consistency! You're becoming unstoppable!", emoji: "⚡", reward: "+$25 bonus" },
  30: { title: "🏆 Monthly Master!", subtitle: "30 days of coding! You've proven your dedication!", emoji: "🏆", reward: "+$50 bonus" },
  100: { title: "💎 Legendary Coder!", subtitle: "100 DAY STREAK! You're in the top 1% of coders!", emoji: "💎", reward: "+$200 bonus" },
};

// Cash reward amounts for each streak milestone
const STREAK_REWARDS: Record<7 | 14 | 30 | 100, number> = { 7: 10, 14: 25, 30: 50, 100: 200 };

// ============================================================
// PROGRESS PROVIDER — wraps the app to provide progress state
// ============================================================
export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(getProgress());
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ title: string; subtitle: string; emoji: string; reward?: string } | null>(null);
  const [hydratedUserId, setHydratedUserId] = useState<string | null>(user?.uid ?? null);

  // 1. Fetch from Supabase whenever user logs in or mounts
  useEffect(() => {
    let active = true;

    if (!user) {
      // Fallback to local storage if not logged in
      setProgress(getProgress());
      setHydratedUserId(null);
      return () => {
        active = false;
      };
    }

    setHydratedUserId(null);
    const localProgress = getProgress();

    supabase
      .from("profiles")
      .select(
        "wallet, streak, last_coding_date, solved_problems, completed_lessons, completed_exercises, unlocked_lessons, xp, activity_map, stars_caught, previous_streak, streak_broken_date, daily_stars, last_star_date, time_spent",
      )
      .eq("id", user.uid)
      .single()
      .then(({ data, error }) => {
        if (!active) return;

        if (error) {
          console.error("Cloud Load Error", error);
          setProgress(localProgress);
          setCloudReady(true);
          return;
        }

        const remoteProgress = profileRowToProgress(data);
        const mergedProgress = mergeProgress(localProgress, remoteProgress);
        setProgress(mergedProgress);
        saveProgress(mergedProgress);
        setHydratedUserId(user.uid);
      });

    return () => {
      active = false;
    };
  }, [user]);

  // 2. Auto-save progress to local storage AND Cloud whenever it changes 
  // (Debounced defensively to optimize the Event Loop and drastically reduce DB calls)
  useEffect(() => {
    if (user && hydratedUserId !== user.uid) {
      return;
    }

    const handler = setTimeout(() => {
      saveProgress(progress);
      
      // Background cloud sync!
      if (user) {
        supabase.from('profiles').upsert({
          id: user.uid,
          ...progressToProfileUpdate(progress),
        }).then(({ error }) => {
          if (error) console.error("Cloud Sync Error", error);
        });
      }
    }, 1500); // 1.5 sec global execution buffer
    
    return () => clearTimeout(handler);
  }, [hydratedUserId, progress, user]);

  // ---------- Celebration trigger ----------
  // Shows the celebration modal with confetti and sound
  const triggerCelebration = useCallback((title: string, subtitle: string, emoji: string, reward?: string) => {
    setCelebrationData({ title, subtitle, emoji, reward });
    setShowCelebration(true);
    playCelebrationSound();
    // Fire confetti particles in brand colors
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ["#3b82f6", "#22c55e", "#eab308"] });
  }, []);

  // Close the celebration modal
  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
    setCelebrationData(null);
  }, []);

  // ---------- Streak milestone handler ----------
  // Called when user hits 7, 14, 30, or 100 day streak
  const handleStreakMilestone = useCallback((milestone: 7 | 14 | 30 | 100) => {
    const data = STREAK_MILESTONES[milestone];
    setTimeout(() => {
      playLevelUpSound();
      // Fire orange/gold confetti for streak celebrations
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors: ["#ff8c00", "#ff4500", "#ffd700", "#ff6347"] });
      triggerCelebration(data.title, data.subtitle, data.emoji, data.reward);
    }, 400); // Small delay so it doesn't overlap other effects
  }, [triggerCelebration]);

  // ---------- Log daily activity ----------
  // Called when user does anything (runs code, solves problem, etc.)
  // Updates the streak and activity heatmap
  const logActivity = useCallback(() => {
    setProgress(prev => {
      const result = recordActivity(prev);
      // Check if this activity triggered a streak milestone
      if (result.streakMilestone) {
        handleStreakMilestone(result.streakMilestone);
        // Add the milestone bonus to wallet
        return {
          ...result.progress,
          wallet: result.progress.wallet + STREAK_REWARDS[result.streakMilestone],
        };
      }
      return result.progress;
    });
  }, [handleStreakMilestone]);

  // ---------- Catch a shooting star ----------
  // Stars appear on the landing page — clicking them gives XP
  const catchStar = useCallback((xpGain: number) => {
    setProgress(prev => {
      // Increment star count and XP, then record the activity
      const result = recordActivity({
        ...prev,
        starsCaught: prev.starsCaught + 1,
        xp: prev.xp + xpGain,
      });
      if (result.streakMilestone) {
        handleStreakMilestone(result.streakMilestone);
        return {
          ...result.progress,
          wallet: result.progress.wallet + STREAK_REWARDS[result.streakMilestone],
        };
      }
      return result.progress;
    });
  }, [handleStreakMilestone]);

  // ---------- GTA-Style Daily Stars ----------
  // Max 3 stars per day. Triggers a massive reward at 3.
  const addDailyStar = useCallback(() => {
    setProgress(prev => {
      const today = new Date().toISOString().split("T")[0];
      let currentStars = prev.dailyStars;
      
      // Reset if it's a new day
      if (prev.lastStarDate !== today) {
        currentStars = 0;
      }
      
      // Max out at 3
      if (currentStars >= 3) return prev;
      
      const newStars = currentStars + 1;
      
      if (newStars === 3) {
        // MISSION PASSED: GTA Style Celebration!
        setTimeout(() => {
          triggerCelebration(
            "⭐ MISSION PASSED ⭐",
            "RESPECT +100 | You caught all 3 daily stars! Today's tasks are done!",
            "⭐",
            "+$20 bonus"
          );
        }, 800);
        return {
          ...prev,
          dailyStars: 3,
          lastStarDate: today,
          wallet: prev.wallet + 20,
          xp: prev.xp + 100
        };
      }
      
      return {
        ...prev,
        dailyStars: newStars,
        lastStarDate: today,
        xp: prev.xp + 10
      };
    });
  }, [triggerCelebration]);

  // ---------- Unlock a lesson by paying $25 ----------
  // Returns true if successful, false if not enough money
  const unlockLesson = useCallback((lessonId: string, cost = 25): boolean => {
    let success = false;
    setProgress(prev => {
      // Already unlocked? No cost needed
      if (prev.unlockedLessons.includes(lessonId)) { success = true; return prev; }
      // Not enough money? Can't unlock
      if (cost > 0 && prev.wallet < cost) { success = false; return prev; }
      // Deduct cost and add to unlocked list
      success = true;
      return {
        ...prev,
        wallet: prev.wallet - cost,
        unlockedLessons: [...prev.unlockedLessons, lessonId],
      };
    });
    return success;
  }, []);

  // ---------- Solve a coding problem ----------
  // Awards cash based on difficulty, triggers milestones & badge checks
  const solveProblem = useCallback((problemId: string, difficulty: string) => {
    setProgress(prev => {
      // Don't award twice for the same problem
      if (prev.solvedProblems.includes(problemId)) return prev;

      // Calculate reward based on difficulty (basic=$5, expert=$100)
      const reward = getRewardForDifficulty(difficulty);

      // Add to solved list, wallet, and XP, then record activity
      const result = recordActivity({
        ...prev,
        solvedProblems: [...prev.solvedProblems, problemId],
        wallet: prev.wallet + reward,
        xp: prev.xp + reward * 10,
      });
      
      let updated = result.progress;
      
      // Handle streak milestone if triggered
      if (result.streakMilestone) {
        handleStreakMilestone(result.streakMilestone);
        updated = { ...updated, wallet: updated.wallet + STREAK_REWARDS[result.streakMilestone] };
      }
      
      // Celebrate problem-solving milestones (1st, 10th, 25th, 50th)
      const count = updated.solvedProblems.length;
      if (count === 1 || count === 10 || count === 25 || count === 50) {
        setTimeout(() => {
          triggerCelebration(
            count === 1 ? "🎯 First Blood!" : `🏆 ${count} Problems Solved!`,
            count === 1 ? "You solved your first problem! You're officially a coder!" : `Amazing! You've conquered ${count} challenges!`,
            count >= 50 ? "💎" : count >= 25 ? "🏆" : count >= 10 ? "🥈" : "🎯",
            `+$${reward} earned`
          );
        }, 500);
      }

      // Check if a new difficulty badge was earned
      // Compare badges before and after solving
      const prevBadges = getEarnedBadges(prev.solvedProblems, problems).filter(b => b.earned);
      const newBadges = getEarnedBadges(updated.solvedProblems, problems).filter(b => b.earned);
      if (newBadges.length > prevBadges.length) {
        // Find the newly earned badge
        const earnedBadge = newBadges.find(b => !prevBadges.some(pb => pb.badge.id === b.badge.id));
        if (earnedBadge) {
          setTimeout(() => {
            playLevelUpSound();
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ["#FFD700", "#3b82f6", "#22c55e", "#a855f7"] });
            triggerCelebration(
              `🏅 Badge Unlocked!`,
              `You earned the "${earnedBadge.badge.title}" badge! All ${earnedBadge.badge.difficulty} problems complete!`,
              "🏅",
              "New Badge Earned!"
            );
          }, 1200); // Delayed so it doesn't overlap the problem celebration
        }
      }

      return updated;
    });
  }, [triggerCelebration, handleStreakMilestone]);

  // ---------- Complete a lesson ----------
  // Awards 50 XP and shows a celebration
  const completeLesson = useCallback((lessonId: string) => {
    setProgress(prev => {
      // Don't award twice
      if (prev.completedLessons.includes(lessonId)) return prev;

      const result = recordActivity({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        xp: prev.xp + 50,
      });
      
      let updated = result.progress;
      
      if (result.streakMilestone) {
        handleStreakMilestone(result.streakMilestone);
        updated = { ...updated, wallet: updated.wallet + STREAK_REWARDS[result.streakMilestone] };
      }
      
      // Show lesson completion celebration
      setTimeout(() => {
        playApplauseSound();
        triggerCelebration(
          "📚 Lesson Complete!",
          `You've mastered another topic! Keep the momentum going!`,
          "🎓",
          "+50 XP"
        );
      }, 300);
      return updated;
    });
  }, [triggerCelebration, handleStreakMilestone]);

  // ---------- Complete an exercise ----------
  // Awards 25 XP + $5, checks if all 3 exercises in a lesson are done
  const completeExercise = useCallback((exerciseKey: string) => {
    setProgress(prev => {
      if (prev.completedExercises.includes(exerciseKey)) return prev;

      const result = recordActivity({
        ...prev,
        completedExercises: [...prev.completedExercises, exerciseKey],
        xp: prev.xp + 25,
        wallet: prev.wallet + 5,
      });

      let updated = result.progress;
      
      if (result.streakMilestone) {
        handleStreakMilestone(result.streakMilestone);
        updated = { ...updated, wallet: updated.wallet + STREAK_REWARDS[result.streakMilestone] };
      }

      // Check if ALL 3 exercises of this lesson are now done
      // Exercise keys are formatted as "lessonId:level"
      const lessonId = exerciseKey.split(":")[0];
      const levels = ["beginner", "intermediate", "advanced"];
      const allDone = levels.every(l => updated.completedExercises.includes(`${lessonId}:${l}`));
      if (allDone) {
        setTimeout(() => {
          playLevelUpSound();
          triggerCelebration(
            "⭐ Module Champion!",
            "You completed ALL exercises in this module! You're unstoppable!",
            "👑",
            "+$5 bonus"
          );
        }, 600);
      }

      return updated;
    });
  }, [triggerCelebration, handleStreakMilestone]);

  // ---------- Streak recovery ----------
  // Check if the user can recover their broken streak
  const canRecover = canRecoverStreak(progress);
  // Calculate the cost based on previous streak length
  const recoveryCost = getStreakRecoveryCost(progress.previousStreak);

  // Attempt to restore a broken streak by paying the recovery cost
  const attemptStreakRecovery = useCallback((): boolean => {
    const recovered = recoverStreak(progress);
    if (!recovered) return false; // Not eligible or can't afford it
    setProgress(recovered);
    setTimeout(() => {
      playCelebrationSound();
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ["#ff8c00", "#ffd700", "#22c55e"] });
      triggerCelebration(
        "🔥 Streak Restored!",
        `Your ${recovered.streak}-day streak is back! Don't let it break again!`,
        "🛡️",
        `-$${recoveryCost} spent`
      );
    }, 200);
    return true;
  }, [progress, recoveryCost, triggerCelebration]);

  // ---------- Add/subtract from wallet ----------
  const addWallet = useCallback((amount: number) => {
    setProgress(prev => ({ ...prev, wallet: prev.wallet + amount }));
  }, []);

  const addTimeSpent = useCallback((seconds: number) => {
    setProgress(prev => ({ ...prev, timeSpent: (prev.timeSpent || 0) + seconds }));
  }, []);

  // Provide all progress state and actions to child components
  return (
    <ProgressContext.Provider value={{ progress, solveProblem, completeLesson, completeExercise, logActivity, catchStar, addDailyStar, unlockLesson, attemptStreakRecovery, addWallet, addTimeSpent, canRecover, recoveryCost, showCelebration, celebrationData, dismissCelebration }}>
      {children}
    </ProgressContext.Provider>
  );
}

// ============================================================
// HOOK — useProgress()
// Use this in any component to access progress state & actions
// Must be inside <ProgressProvider>
// ============================================================
export function useProgress(): ProgressContextType {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return ctx;
}
