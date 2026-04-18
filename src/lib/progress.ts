// ============================================================
// PROGRESS SYSTEM — src/lib/progress.ts
// Manages user progress data using localStorage.
// Handles streaks, XP, wallet, activity tracking, and more.
// ============================================================

// --- TypeScript Interface: defines the shape of user progress data ---
export interface UserProgress {
  wallet: number; // Virtual currency earned by solving problems
  streak: number; // Number of consecutive days of coding
  lastCodingDate: string | null; // Last date the user coded (YYYY-MM-DD)
  solvedProblems: string[]; // Array of solved problem IDs
  completedLessons: string[]; // Array of completed lesson IDs
  completedExercises: string[]; // Array like "lessonId:beginner", "lessonId:intermediate"
  unlockedLessons: string[]; // Lesson IDs unlocked by spending wallet cash
  unlockedSolutions: string[]; // Exercise keys unlocked after paying once
  xp: number; // Experience points earned
  activityMap: Record<string, number>; // Maps "YYYY-MM-DD" → activity count for that day
  starsCaught: number; // How many shooting stars the user has caught
  previousStreak: number; // Streak value before it was broken (for recovery)
  streakBrokenDate: string | null; // Date when the streak was broken
  dailyStars: number; // For the GTA-style daily wanted level
  lastStarDate: string | null; // Date when the last daily star was earned
  timeSpent: number; // Total time spent learning in seconds
}

export interface ProgressProfileRow {
  wallet?: number | null;
  streak?: number | null;
  last_coding_date?: string | null;
  solved_problems?: unknown;
  completed_lessons?: unknown;
  completed_exercises?: unknown;
  unlocked_lessons?: unknown;
  xp?: number | null;
  activity_map?: unknown;
  stars_caught?: number | null;
  previous_streak?: number | null;
  streak_broken_date?: string | null;
  daily_stars?: number | null;
  last_star_date?: string | null;
  time_spent?: number | null;
}

// Key used to store progress in localStorage
const STORAGE_KEY = "pymaster_progress";

// Default values for a new user
export const defaultProgress: UserProgress = {
  wallet: 0,
  streak: 0,
  lastCodingDate: null,
  solvedProblems: [],
  completedLessons: [],
  completedExercises: [],
  unlockedLessons: [],
  unlockedSolutions: [],
  xp: 0,
  activityMap: {},
  starsCaught: 0,
  previousStreak: 0,
  streakBrokenDate: null,
  dailyStars: 0,
  lastStarDate: null,
  timeSpent: 0,
};

export function getTodayLocalDateString(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getEffectiveDailyStars(progress: UserProgress, today = getTodayLocalDateString()): number {
  return progress.lastStarDate === today ? progress.dailyStars : 0;
}

/**
 * Load progress from localStorage.
 * Falls back to default values if nothing is saved or if data is corrupted.
 */
export function getProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultProgress,
        ...parsed,
        solvedProblems: Array.isArray(parsed.solvedProblems) ? parsed.solvedProblems : defaultProgress.solvedProblems,
        completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : defaultProgress.completedLessons,
        completedExercises: Array.isArray(parsed.completedExercises) ? parsed.completedExercises : defaultProgress.completedExercises,
        unlockedLessons: Array.isArray(parsed.unlockedLessons) ? parsed.unlockedLessons : defaultProgress.unlockedLessons,
        unlockedSolutions: Array.isArray(parsed.unlockedSolutions) ? parsed.unlockedSolutions : defaultProgress.unlockedSolutions,
      };
    }
  } catch {
    // Fall back to defaults when local data is unavailable or malformed.
  }
  return { ...defaultProgress };
}

/**
 * Save progress to localStorage.
 * Called whenever progress changes (via ProgressContext).
 */
export function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/**
 * Completely wipe all progress from localStorage.
 * Used during logout to prevent session leaking.
 */
export function clearLocalProgress() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("pymaster_name");
  localStorage.removeItem("pymaster_bio");
  localStorage.removeItem("pymaster_avatar");
  localStorage.removeItem("pymaster_skills");
  localStorage.removeItem("pymaster_profile_complete");
  localStorage.removeItem("pymaster_selected_emoji");
  localStorage.removeItem("pymaster_avatar_id");
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asActivityMap(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number",
    ),
  );
}

function maxDateString(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

function mergeDailyStars(local: UserProgress, remote: UserProgress) {
  const lastStarDate = maxDateString(local.lastStarDate, remote.lastStarDate);
  if (!lastStarDate) {
    return { dailyStars: 0, lastStarDate: null };
  }

  if (local.lastStarDate === remote.lastStarDate) {
    return {
      dailyStars: Math.max(local.dailyStars, remote.dailyStars),
      lastStarDate,
    };
  }

  return local.lastStarDate === lastStarDate
    ? { dailyStars: local.dailyStars, lastStarDate }
    : { dailyStars: remote.dailyStars, lastStarDate };
}

function mergeActivityMap(localMap: Record<string, number>, remoteMap: Record<string, number>) {
  const keys = new Set([...Object.keys(localMap), ...Object.keys(remoteMap)]);

  return Array.from(keys).reduce<Record<string, number>>((acc, key) => {
    acc[key] = Math.max(localMap[key] ?? 0, remoteMap[key] ?? 0);
    return acc;
  }, {});
}

export function profileRowToProgress(row?: ProgressProfileRow | null): UserProgress {
  if (!row) {
    return { ...defaultProgress };
  }

  return {
    ...defaultProgress,
    wallet: row.wallet ?? defaultProgress.wallet,
    streak: row.streak ?? defaultProgress.streak,
    lastCodingDate: row.last_coding_date ?? defaultProgress.lastCodingDate,
    solvedProblems: asStringArray(row.solved_problems),
    completedLessons: asStringArray(row.completed_lessons),
    completedExercises: asStringArray(row.completed_exercises),
    unlockedLessons: asStringArray(row.unlocked_lessons),
    xp: row.xp ?? defaultProgress.xp,
    activityMap: asActivityMap(row.activity_map),
    starsCaught: row.stars_caught ?? defaultProgress.starsCaught,
    previousStreak: row.previous_streak ?? defaultProgress.previousStreak,
    streakBrokenDate: row.streak_broken_date ?? defaultProgress.streakBrokenDate,
    dailyStars: row.daily_stars ?? defaultProgress.dailyStars,
    lastStarDate: row.last_star_date ?? defaultProgress.lastStarDate,
    timeSpent: row.time_spent ?? defaultProgress.timeSpent,
  };
}

export function progressToProfileUpdate(progress: UserProgress): ProgressProfileRow {
  return {
    wallet: progress.wallet,
    streak: progress.streak,
    last_coding_date: progress.lastCodingDate,
    solved_problems: progress.solvedProblems,
    completed_lessons: progress.completedLessons,
    completed_exercises: progress.completedExercises,
    unlocked_lessons: progress.unlockedLessons,
    xp: progress.xp,
    activity_map: progress.activityMap,
    stars_caught: progress.starsCaught,
    previous_streak: progress.previousStreak,
    streak_broken_date: progress.streakBrokenDate,
    daily_stars: progress.dailyStars,
    last_star_date: progress.lastStarDate,
    time_spent: progress.timeSpent,
  };
}

export function mergeProgress(local: UserProgress, remote: UserProgress): UserProgress {
  const dailyStars = mergeDailyStars(local, remote);
  const activityMap = mergeActivityMap(local.activityMap, remote.activityMap);

  return {
    ...defaultProgress,
    wallet: Math.max(local.wallet, remote.wallet),
    streak: Math.max(local.streak, remote.streak),
    lastCodingDate: maxDateString(local.lastCodingDate, remote.lastCodingDate),
    solvedProblems: Array.from(new Set([...local.solvedProblems, ...remote.solvedProblems])),
    completedLessons: Array.from(new Set([...local.completedLessons, ...remote.completedLessons])),
    completedExercises: Array.from(new Set([...local.completedExercises, ...remote.completedExercises])),
    unlockedLessons: Array.from(new Set([...local.unlockedLessons, ...remote.unlockedLessons])),
    unlockedSolutions: Array.from(new Set([...local.unlockedSolutions, ...remote.unlockedSolutions])),
    xp: Math.max(local.xp, remote.xp),
    activityMap,
    starsCaught: Math.max(local.starsCaught, remote.starsCaught),
    previousStreak: Math.max(local.previousStreak, remote.previousStreak),
    streakBrokenDate: maxDateString(local.streakBrokenDate, remote.streakBrokenDate),
    dailyStars: dailyStars.dailyStars,
    lastStarDate: dailyStars.lastStarDate,
    timeSpent: Math.max(local.timeSpent, remote.timeSpent),
  };
}

// --- Activity Recording ---

export interface ActivityResult {
  progress: UserProgress; // Updated progress after recording activity
  streakMilestone?: 7 | 14 | 30 | 100; // If user just hit a milestone
}

/**
 * Record a coding activity for today.
 * - Increments the activity count for today
 * - Updates streak: +1 if consecutive, reset to 1 if gap
 * - Returns any streak milestone hit (7, 14, 30, 100 days)
 */
export function recordActivity(progress: UserProgress): ActivityResult {
  // Use local date (not UTC) to avoid timezone issues breaking streaks
  const now = new Date();
  const today = getTodayLocalDateString(now);
  
  const updated = { ...progress };
  updated.activityMap = { ...progress.activityMap };
  updated.activityMap[today] = (updated.activityMap[today] || 0) + 1; // Increment today's count

  let streakMilestone: 7 | 14 | 30 | 100 | undefined;

  // Only update streak if today is a new day (not already counted)
  if (progress.lastCodingDate !== today) {
    // Calculate yesterday's date string
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getTodayLocalDateString(yesterdayDate);
    
    const prevStreak = progress.streak;
    
    if (progress.lastCodingDate === yesterday) {
      // User coded yesterday too → continue the streak
      updated.streak = progress.streak + 1;
    } else {
      // Gap detected → streak is broken
      if (progress.streak > 1) {
        // Save the broken streak for possible recovery
        updated.previousStreak = progress.streak;
        updated.streakBrokenDate = today;
      }
      updated.streak = 1; // Start fresh
    }
    updated.lastCodingDate = today;

    // Check if we just crossed a milestone (7, 14, 30, or 100 days)
    const milestones: (7 | 14 | 30 | 100)[] = [7, 14, 30, 100];
    for (const m of milestones) {
      if (prevStreak < m && updated.streak >= m) {
        streakMilestone = m;
        break;
      }
    }
  }

  return { progress: updated, streakMilestone };
}

/**
 * Get a title based on streak length.
 * Used in the dashboard and navbar to show user rank.
 */
export function getStreakTitle(streak: number): string {
  if (streak >= 100) return "Python Master";
  if (streak >= 30) return "Dedicated Coder";
  if (streak >= 7) return "Python Explorer";
  return "Python Beginner";
}

/**
 * Get level title, numerical level, and theme color based on XP.
 * Level formula: Level = floor(XP / 500) + 1
 * Titles:
 * Lv 1-3: Beginner
 * Lv 4-6: Junior
 * Lv 7-9: Intermediate
 * Lv 10-12: Advanced
 * Lv 13+: Expert
 */
export function getXpLevel(xp: number): { title: string; level: number; progressPercentage: number; color: string; bg: string; border: string } {
  const level = Math.floor(xp / 500) + 1;
  const progressPercentage = Math.min(100, Math.max(0, ((xp % 500) / 500) * 100));
  
  let title = "Beginner";
  let theme = { color: "text-muted-foreground", bg: "bg-muted/10", border: "border-muted/30" };

  if (level >= 13) {
    title = "Expert";
    theme = { color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" };
  } else if (level >= 10) {
    title = "Advanced";
    theme = { color: "text-expert-purple", bg: "bg-expert-purple/10", border: "border-expert-purple/30" };
  } else if (level >= 7) {
    title = "Intermediate";
    theme = { color: "text-reward-gold", bg: "bg-reward-gold/10", border: "border-reward-gold/30" };
  } else if (level >= 4) {
    title = "Junior";
    theme = { color: "text-python-blue", bg: "bg-python-blue/10", border: "border-python-blue/30" };
  }

  return { title, level, progressPercentage, ...theme };
}

/**
 * Get trophy info based on how many stars the user has caught.
 * Returns the current trophy emoji, title, and how many stars until the next tier.
 */
export function getTrophyForStars(stars: number): { emoji: string; title: string; next: number } {
  if (stars >= 2000) return { emoji: "🐍", title: "Python Trophy", next: 0 };
  if (stars >= 1000) return { emoji: "🐉", title: "Dragon Master", next: 2000 };
  if (stars >= 500) return { emoji: "👑", title: "Legendary Crown", next: 1000 };
  if (stars >= 350) return { emoji: "🌟", title: "Supernova", next: 500 };
  if (stars >= 200) return { emoji: "💎", title: "Diamond", next: 350 };
  if (stars >= 100) return { emoji: "🏆", title: "Gold", next: 200 };
  if (stars >= 50) return { emoji: "🥈", title: "Silver", next: 100 };
  if (stars >= 20) return { emoji: "🥉", title: "Bronze", next: 50 };
  return { emoji: "⭐", title: "Star Catcher", next: 20 };
}

/**
 * Get wallet reward amount based on problem difficulty.
 * Harder problems pay more virtual currency.
 */
export function getRewardForDifficulty(difficulty: string): number {
  switch (difficulty) {
    case "basic": return 5;
    case "junior": return 10;
    case "intermediate": return 25;
    case "advanced": return 50;
    case "expert": return 100;
    default: return 5;
  }
}

/**
 * Calculate the cost to recover a broken streak.
 * Longer streaks cost more to recover (they're more valuable).
 */
export function getStreakRecoveryCost(previousStreak: number): number {
  if (previousStreak >= 100) return 150;
  if (previousStreak >= 30) return 75;
  if (previousStreak >= 14) return 40;
  if (previousStreak >= 7) return 20;
  return 10;
}

/**
 * Check if the user can recover their broken streak.
 * Recovery is only possible on the same day the streak was broken.
 */
export function canRecoverStreak(progress: UserProgress): boolean {
  if (!progress.streakBrokenDate || progress.previousStreak < 2) return false;
  return progress.streakBrokenDate === getTodayLocalDateString();
}

/**
 * Attempt to recover a broken streak by spending wallet money.
 * Returns the updated progress if successful, or null if not possible.
 */
export function recoverStreak(progress: UserProgress): UserProgress | null {
  if (!canRecoverStreak(progress)) return null;
  const cost = getStreakRecoveryCost(progress.previousStreak);
  if (progress.wallet < cost) return null;
  
  return {
    ...progress,
    wallet: progress.wallet - cost, // Deduct the recovery cost
    streak: progress.previousStreak + 1, // Restore streak + 1 for today
    previousStreak: 0, // Clear recovery data
    streakBrokenDate: null,
  };
}
