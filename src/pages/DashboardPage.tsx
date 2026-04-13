// ============================================================
// DASHBOARD PAGE — src/pages/DashboardPage.tsx
// User dashboard with profile editing, stats overview, emoji
// shop, star trophy progress, activity heatmap, and badges.
// ============================================================
import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProgress } from "@/contexts/ProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import { getStreakTitle, getTrophyForStars } from "@/lib/progress";
import { problems } from "@/data/problems";
import { lessons } from "@/data/lessons";
import { ActivityGraph } from "@/components/ActivityGraph";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { StreakFire } from "@/components/StreakFire";
import { SectionErrorBoundary } from "@/components/SectionErrorBoundary";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Code, Flame, Target, Zap, Star, Award, Camera, Pencil, Check, ShoppingBag, Clock, Share2, Copy, Download, Palette, Medal, CheckCircle2, Crown, ArrowUpRight, Sparkles, Save, Github, Linkedin, Globe, CircleHelp, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { getPublicUrl } from "@/lib/public-url";
import { TrophyHall } from "@/components/TrophyHall";


const EMOJI_SHOP: {emoji: string;name: string;price: number;legendary?: boolean;}[] = [
{ emoji: "🌱", name: "Seedling", price: 5 },
{ emoji: "🐣", name: "Baby Chick", price: 8 },
{ emoji: "🎯", name: "Bullseye", price: 10 },
{ emoji: "🌸", name: "Blossom", price: 12 },
{ emoji: "🐍", name: "Python Snake", price: 15 },
{ emoji: "🦊", name: "Fox", price: 18 },
{ emoji: "🚀", name: "Rocket", price: 20 },
{ emoji: "🤖", name: "Robot", price: 25 },
{ emoji: "🦄", name: "Unicorn", price: 30 },
{ emoji: "👾", name: "Space Alien", price: 35 },
{ emoji: "🔮", name: "Crystal Ball", price: 40 },
{ emoji: "💫", name: "Shooting Star", price: 45 },
{ emoji: "🌊", name: "Wave Rider", price: 50 },
{ emoji: "⚔️", name: "Warrior", price: 60 },
{ emoji: "🧙", name: "Wizard", price: 75 },
{ emoji: "🦅", name: "Eagle", price: 90 },
{ emoji: "⚡", name: "Thunder God", price: 100 },
{ emoji: "🐉", name: "Dragon", price: 125 },
{ emoji: "👑", name: "Crown", price: 150 },
{ emoji: "💀", name: "Skull King", price: 200 },
{ emoji: "🔥", name: "Fire Lord", price: 250 },
{ emoji: "🌌", name: "Galaxy", price: 350 },
{ emoji: "🧬", name: "DNA Master", price: 500 },
{ emoji: "🦁", name: "Lion King", price: 750 },
{ emoji: "🌟", name: "Galaxy God", price: 5000, legendary: true }];


const howToClimb = [
{ emoji: "💻", title: "Solve Problems", desc: "Earn cash & XP by solving coding challenges", link: "/problems" },
{ emoji: "📚", title: "Complete Lessons", desc: "Learn new concepts and earn XP", link: "/learn" },
{ emoji: "❓", title: "Python Quiz", desc: "Practice 200 quiz questions and improve accuracy", link: "/python-quiz-100" },
{ emoji: "⭐", title: "Catch Stars", desc: "Grab shooting stars on the home page", link: "/" },
{ emoji: "🔥", title: "Keep Your Streak", desc: "Code every day for bonus rewards", link: "/compiler" }];

type LeaderboardCompareRow = {
  user_id: string;
  display_name: string;
  xp: number;
  solved_count: number;
  streak: number;
  wallet: number;
};

const DASHBOARD_THEMES = [
  {
    id: "pymaster",
    name: "PyMaster",
    shell: "bg-gradient-to-br from-background via-background to-primary/5",
    hero: "border-primary/20 bg-gradient-to-r from-primary/10 via-background to-python-yellow/10",
  },
  {
    id: "mint",
    name: "Mint",
    shell: "bg-gradient-to-br from-background via-emerald-500/5 to-cyan-500/10",
    hero: "border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-background to-cyan-500/10",
  },
  {
    id: "sunset",
    name: "Sunset",
    shell: "bg-gradient-to-br from-background via-orange-500/5 to-rose-500/10",
    hero: "border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-background to-rose-500/10",
  },
];

type SocialLinks = {
  github: string;
  linkedin: string;
  portfolio: string;
};

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  github: "",
  linkedin: "",
  portfolio: "",
};

function readSocialLinks(): SocialLinks {
  try {
    const parsed = JSON.parse(localStorage.getItem("pymaster_social_links") || "{}");
    return {
      github: typeof parsed.github === "string" ? parsed.github : "",
      linkedin: typeof parsed.linkedin === "string" ? parsed.linkedin : "",
      portfolio: typeof parsed.portfolio === "string" ? parsed.portfolio : "",
    };
  } catch {
    return DEFAULT_SOCIAL_LINKS;
  }
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

const TIME_GIFT_INTERVAL_SECONDS = 60 * 60;
const QUIZ_PROGRESS_STORAGE_KEY = "pymaster_quiz_progress_v1";
const DASHBOARD_DENSITY_KEY = "pymaster_dashboard_density";
const DASHBOARD_VIEW_KEY = "pymaster_dashboard_view";
const DASHBOARD_GOAL_PRESET_KEY = "pymaster_dashboard_goal_preset";

type QuizProgressSnapshot = {
  allTotal: number;
  allAnswered: number;
  allScore: number;
  trickyTotal: number;
  trickyAnswered: number;
  trickyScore: number;
  updatedAt: string;
};

const EMPTY_QUIZ_PROGRESS: QuizProgressSnapshot = {
  allTotal: 0,
  allAnswered: 0,
  allScore: 0,
  trickyTotal: 0,
  trickyAnswered: 0,
  trickyScore: 0,
  updatedAt: "",
};

function readQuizProgressSnapshot(): QuizProgressSnapshot {
  if (typeof window === "undefined") return EMPTY_QUIZ_PROGRESS;
  try {
    const parsed = JSON.parse(localStorage.getItem(QUIZ_PROGRESS_STORAGE_KEY) || "{}");
    return {
      allTotal: typeof parsed.allTotal === "number" ? parsed.allTotal : 0,
      allAnswered: typeof parsed.allAnswered === "number" ? parsed.allAnswered : 0,
      allScore: typeof parsed.allScore === "number" ? parsed.allScore : 0,
      trickyTotal: typeof parsed.trickyTotal === "number" ? parsed.trickyTotal : 0,
      trickyAnswered: typeof parsed.trickyAnswered === "number" ? parsed.trickyAnswered : 0,
      trickyScore: typeof parsed.trickyScore === "number" ? parsed.trickyScore : 0,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return EMPTY_QUIZ_PROGRESS;
  }
}


export default function DashboardPage() {
  const { progress, attemptStreakRecovery, canRecover, recoveryCost, addWallet } = useProgress();
  const { user, profile, saveProfile } = useAuth();
  const title = getStreakTitle(progress.streak);
  const trophy = getTrophyForStars(progress.starsCaught);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Purchased emojis (localStorage)
  const [purchasedEmojis, setPurchasedEmojis] = useState<string[]>(() => {
    try {return JSON.parse(localStorage.getItem("pymaster_emojis") || "[]");} catch {return [];}
  });
  const [selectedEmoji, setSelectedEmoji] = useState(() => localStorage.getItem("pymaster_selected_emoji") || "");

  // Profile state (localStorage-backed)
  const [profileName, setProfileName] = useState(() => localStorage.getItem("pymaster_name") || "Python Learner");
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem("pymaster_avatar") || "");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profileName);
  const [dashboardTheme, setDashboardTheme] = useState(() => localStorage.getItem("pymaster_dashboard_theme") || "pymaster");
  const [compareUsers, setCompareUsers] = useState<LeaderboardCompareRow[]>([]);
  const [exportingShareCard, setExportingShareCard] = useState(false);
  // Saved values: shown on the share card (only what the user has actually saved)
  const [savedProfileBio, setSavedProfileBio] = useState(() => localStorage.getItem("pymaster_bio") || "");
  const [savedSkills, setSavedSkills] = useState<string[]>(() => {
    try {
      const cachedSkills = JSON.parse(localStorage.getItem("pymaster_skills") || "[]");
      return Array.isArray(cachedSkills) ? cachedSkills.filter((x): x is string => typeof x === "string") : [];
    } catch {
      return [];
    }
  });
  const [savedSocialLinks, setSavedSocialLinks] = useState<SocialLinks>(() => readSocialLinks());

  // Draft values: editable form state (can differ from saved until user clicks Save)
  const [draftProfileBio, setDraftProfileBio] = useState(() => localStorage.getItem("pymaster_bio") || "");
  const [draftSkillsInput, setDraftSkillsInput] = useState(() => {
    try {
      const cachedSkills = JSON.parse(localStorage.getItem("pymaster_skills") || "[]");
      return Array.isArray(cachedSkills) ? cachedSkills.join(", ") : "";
    } catch {
      return "";
    }
  });
  const [draftSocialLinks, setDraftSocialLinks] = useState<SocialLinks>(() => readSocialLinks());
  const [savingProfileDetails, setSavingProfileDetails] = useState(false);
  const [giftTick, setGiftTick] = useState(0);
  const [quizProgress, setQuizProgress] = useState<QuizProgressSnapshot>(() => readQuizProgressSnapshot());
  const [dashboardDensity, setDashboardDensity] = useState<"full" | "focus">(
    () => (localStorage.getItem(DASHBOARD_DENSITY_KEY) as "full" | "focus") || "full",
  );
  const [dashboardView, setDashboardView] = useState<"overview" | "insights" | "customize">(
    () => (localStorage.getItem(DASHBOARD_VIEW_KEY) as "overview" | "insights" | "customize") || "overview",
  );
  const [goalPreset, setGoalPreset] = useState<"steady" | "focused" | "sprint">(
    () => (localStorage.getItem(DASHBOARD_GOAL_PRESET_KEY) as "steady" | "focused" | "sprint") || "steady",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile) return;
    if (profile.displayName) {
      setProfileName(profile.displayName);
      setNameInput(profile.displayName);
    }
    if (profile.avatarUrl) {
      setProfilePic(profile.avatarUrl);
    }
    const nextBio = profile.bio || "";
    const nextSkills = (profile.skills || []).filter((x): x is string => typeof x === "string");
    setSavedProfileBio(nextBio);
    setSavedSkills(nextSkills);
    setDraftProfileBio(nextBio);
    setDraftSkillsInput(nextSkills.join(", "));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("pymaster_dashboard_theme", dashboardTheme);
  }, [dashboardTheme]);

  useEffect(() => {
    localStorage.setItem(DASHBOARD_DENSITY_KEY, dashboardDensity);
  }, [dashboardDensity]);

  useEffect(() => {
    localStorage.setItem(DASHBOARD_VIEW_KEY, dashboardView);
  }, [dashboardView]);

  useEffect(() => {
    localStorage.setItem(DASHBOARD_GOAL_PRESET_KEY, goalPreset);
  }, [goalPreset]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setGiftTick((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const refreshQuizProgress = () => setQuizProgress(readQuizProgressSnapshot());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === QUIZ_PROGRESS_STORAGE_KEY) {
        refreshQuizProgress();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("pymaster-quiz-progress-updated", refreshQuizProgress as EventListener);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("pymaster-quiz-progress-updated", refreshQuizProgress as EventListener);
    };
  }, []);

  useEffect(() => {
    let active = true;

    supabase.rpc("get_leaderboard").then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error("Compare leaderboard load failed", error);
        return;
      }
      setCompareUsers((data || []) as LeaderboardCompareRow[]);
    });

    return () => {
      active = false;
    };
  }, []);

  const saveName = async () => {
    const nextName = nameInput.trim() || profileName;
    try {
      await saveProfile({
        displayName: nextName,
        bio: profile?.bio || "",
        avatarUrl: profilePic,
        skills: profile?.skills || [],
        profileComplete: true,
      });
      setProfileName(nextName);
      setEditingName(false);
    } catch (error) {
      toast({
        title: "Profile Save Failed",
        description: error instanceof Error ? error.message : "We couldn't save your display name.",
        variant: "destructive",
      });
    }
  };

  const handlePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        await saveProfile({
          displayName: profileName,
          bio: profile?.bio || "",
          avatarUrl: dataUrl,
          skills: profile?.skills || [],
          profileComplete: true,
        });
        setProfilePic(dataUrl);
      } catch (error) {
        toast({
          title: "Avatar Save Failed",
          description: error instanceof Error ? error.message : "We couldn't save your avatar.",
          variant: "destructive",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const buyEmoji = (emoji: string, price: number) => {
    if (purchasedEmojis.includes(emoji)) {
      // Select/deselect
      const next = selectedEmoji === emoji ? "" : emoji;
      setSelectedEmoji(next);
      localStorage.setItem("pymaster_selected_emoji", next);
      toast({ title: next ? `${emoji} equipped!` : "Emoji removed" });
      return;
    }
    if (progress.wallet < price) {
      toast({ title: "Not enough cash!", description: `You need $${price - progress.wallet} more`, variant: "destructive" });
      return;
    }
    addWallet(-price);
    const updated = [...purchasedEmojis, emoji];
    setPurchasedEmojis(updated);
    setSelectedEmoji(emoji);
    localStorage.setItem("pymaster_emojis", JSON.stringify(updated));
    localStorage.setItem("pymaster_selected_emoji", emoji);
    toast({ title: `${emoji} Purchased!`, description: `You bought "${EMOJI_SHOP.find((e) => e.emoji === emoji)?.name}" for $${price}` });
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const selectedTheme = DASHBOARD_THEMES.find((theme) => theme.id === dashboardTheme) || DASHBOARD_THEMES[0];
  const dashboardUrl = getPublicUrl("/dashboard");
  const publicProfileUrl = user?.uid ? getPublicUrl(`/u/${user.uid}`) : dashboardUrl;
  const solvedPct = problems.length ? Math.round(progress.solvedProblems.length / problems.length * 100) : 0;
  const lessonPct = lessons.length ? Math.round(progress.completedLessons.length / lessons.length * 100) : 0;
  const levelNumber = Math.floor(progress.xp / 500) + 1;
  const xpIntoLevel = progress.xp % 500;
  const xpToNextLevel = 500 - xpIntoLevel;
  const certificateUnlocked = progress.xp >= 100;
  const activeDays = Object.keys(progress.activityMap).sort();
  const orderedActivityEntries = Object.entries(progress.activityMap).sort((a, b) => a[0].localeCompare(b[0]));
  const strongestDay = orderedActivityEntries.reduce<[string, number] | null>((best, entry) => {
    if (!best || entry[1] > best[1]) return [entry[0], entry[1]];
    return best;
  }, null);
  const currentDate = new Date();
  const isoForOffset = (offset: number) => {
    const date = new Date();
    date.setDate(currentDate.getDate() - offset);
    return date.toLocaleDateString("en-CA");
  };
  const weeklyProblemGoal = Math.min(progress.solvedProblems.length, 5);
  const weeklyXpValue = orderedActivityEntries
    .filter(([day]) => day >= isoForOffset(6))
    .reduce((sum, [, count]) => sum + count * 10, 0);
  const previousWeekXpValue = orderedActivityEntries
    .filter(([day]) => day >= isoForOffset(13) && day < isoForOffset(6))
    .reduce((sum, [, count]) => sum + count * 10, 0);
  const weeklyStreakGoal = Math.min(progress.streak, 7);
  const goalTargetByPreset = {
    steady: { problems: 5, xp: 100, streak: 7 },
    focused: { problems: 8, xp: 180, streak: 7 },
    sprint: { problems: 12, xp: 260, streak: 7 },
  } as const;
  const goalTargets = goalTargetByPreset[goalPreset];
  const weeklyGoals = [
    { label: `Solve ${goalTargets.problems} problems`, current: Math.min(progress.solvedProblems.length, goalTargets.problems), target: goalTargets.problems, helper: `${progress.solvedProblems.length} solved overall` },
    { label: `Earn ${goalTargets.xp} XP`, current: Math.min(weeklyXpValue, goalTargets.xp), target: goalTargets.xp, helper: `${weeklyXpValue} XP from recent activity` },
    { label: "Keep a 7-day streak", current: weeklyStreakGoal, target: goalTargets.streak, helper: `${progress.streak} day streak right now` },
  ];
  const weeklyTrendCards = [
    {
      label: "XP Trend",
      current: weeklyXpValue,
      previous: previousWeekXpValue,
      helper: "Last 7 days vs previous 7 days",
    },
    {
      label: "Problems Trend",
      current: Math.min(progress.solvedProblems.length, 20),
      previous: Math.max(0, Math.min(progress.solvedProblems.length - weeklyProblemGoal, 20)),
      helper: "Recent completions momentum",
    },
    {
      label: "Streak Stability",
      current: Math.min(progress.streak, 14),
      previous: Math.max(0, Math.min(progress.previousStreak || 0, 14)),
      helper: "Current streak vs last broken streak",
    },
  ];
  const compareRankings = useMemo(() => {
    const source = compareUsers.length ? compareUsers : [];
    const fallbackName = profile?.displayName || localStorage.getItem("pymaster_name") || "You";
    const merged = user?.uid
      ? [
          {
            user_id: user.uid,
            display_name: fallbackName,
            xp: progress.xp,
            solved_count: progress.solvedProblems.length,
            streak: progress.streak,
            wallet: progress.wallet,
          },
          ...source.filter((entry) => entry.user_id !== user.uid),
        ]
      : source;

    return [...merged]
      .sort((a, b) => b.xp - a.xp || b.streak - a.streak || b.wallet - a.wallet)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  }, [compareUsers, profile?.displayName, progress.solvedProblems.length, progress.streak, progress.wallet, progress.xp, user?.uid]);
  const yourRank = compareRankings.find((entry) => entry.user_id === user?.uid);
  const compareWindow = yourRank
    ? compareRankings.filter((entry) => Math.abs(entry.rank - yourRank.rank) <= 1).slice(0, 3)
    : compareRankings.slice(0, 3);
  const liveTimeSpent = (progress.timeSpent || 0) + (giftTick % 60);
  const countdownRemainder = liveTimeSpent % TIME_GIFT_INTERVAL_SECONDS;
  const secondsUntilGift = countdownRemainder === 0 ? TIME_GIFT_INTERVAL_SECONDS : TIME_GIFT_INTERVAL_SECONDS - countdownRemainder;
  const nextGiftAtHours = Math.floor(liveTimeSpent / TIME_GIFT_INTERVAL_SECONDS) + 1;
  const savedSkillsView = savedSkills
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 8);

  const draftSkillsParsed = draftSkillsInput
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 8);

  const visibleSocialLinks = [
    savedSocialLinks.github ? { label: "GitHub", href: savedSocialLinks.github, icon: Github } : null,
    savedSocialLinks.linkedin ? { label: "LinkedIn", href: savedSocialLinks.linkedin, icon: Linkedin } : null,
    savedSocialLinks.portfolio ? { label: "Portfolio", href: savedSocialLinks.portfolio, icon: Globe } : null,
  ].filter(Boolean) as { label: string; href: string; icon: typeof Github }[];
  const recentActivity = [
    progress.solvedProblems.length > 0 ? `Solved ${progress.solvedProblems.length} total coding problems` : null,
    progress.completedLessons.length > 0 ? `Completed ${progress.completedLessons.length} lessons in the learning track` : null,
    progress.starsCaught > 0 ? `Caught ${progress.starsCaught} stars on the homepage` : null,
    progress.streak > 0 ? `Built a ${progress.streak}-day coding streak` : null,
    progress.wallet > 0 ? `Earned $${progress.wallet} in PyMaster wallet rewards` : null,
  ].filter(Boolean) as string[];
  const showcaseItems = [
    progress.starsCaught >= 1000 ? { emoji: "🐉", title: "Dragon Master", helper: "1000 stars caught" } : null,
    progress.starsCaught >= 500 ? { emoji: "👑", title: "Legendary Crown", helper: "500 stars caught" } : null,
    progress.starsCaught >= 100 ? { emoji: "🏆", title: "Gold Trophy", helper: "100 stars caught" } : null,
    progress.streak >= 100 ? { emoji: "🔥", title: "Python Master Streak", helper: "100-day streak" } : null,
    certificateUnlocked ? { emoji: "📜", title: "Certificate Eligible", helper: "100 XP reached" } : null,
    progress.completedLessons.length >= 10 ? { emoji: "📚", title: "Lesson Finisher", helper: "10 lessons completed" } : null,
  ].filter(Boolean).slice(0, 3) as { emoji: string; title: string; helper: string }[];
  const allQuizAnsweredPct = quizProgress.allTotal ? Math.round((quizProgress.allAnswered / quizProgress.allTotal) * 100) : 0;
  const trickyQuizAnsweredPct = quizProgress.trickyTotal ? Math.round((quizProgress.trickyAnswered / quizProgress.trickyTotal) * 100) : 0;
  const quizAccuracy = quizProgress.allAnswered ? Math.round((quizProgress.allScore / quizProgress.allAnswered) * 100) : 0;
  const trickyAccuracy = quizProgress.trickyAnswered ? Math.round((quizProgress.trickyScore / quizProgress.trickyAnswered) * 100) : 0;
  const nextFocusAction = progress.solvedProblems.length < 5
    ? { title: "Solve your next coding challenge", helper: "Build momentum with one easy problem", to: "/problems", cta: "Solve Problem" }
    : progress.completedLessons.length < 10
      ? { title: "Resume your learning path", helper: "Complete one lesson to increase your baseline", to: "/learn", cta: "Continue Lessons" }
      : quizProgress.allAnswered < 25
        ? { title: "Improve quiz accuracy", helper: "Answer 10 quiz questions in one go", to: "/python-quiz-100", cta: "Take Quiz" }
        : { title: "Ship one compiler run", helper: "Stay consistent with a quick practice run", to: "/compiler", cta: "Open Compiler" };
  const streakResetSeconds = (() => {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    return Math.max(0, Math.floor((nextMidnight.getTime() - now.getTime()) / 1000));
  })();
  const streakResetLabel = formatCountdown(streakResetSeconds);
  const timelineItems = [
    { title: `XP reached ${progress.xp.toLocaleString()}`, helper: "Latest progress snapshot", tone: "text-primary" },
    { title: `${progress.solvedProblems.length} problems solved`, helper: "Strong coding consistency", tone: "text-streak-green" },
    { title: `${progress.completedLessons.length} lessons completed`, helper: "Learning depth improved", tone: "text-blue-400" },
    { title: `${progress.streak}-day streak active`, helper: "Keep it alive before reset", tone: "text-python-yellow" },
  ];
  const showOverview = dashboardView === "overview";
  const showInsights = dashboardView === "insights";
  const showCustomize = dashboardView === "customize";

  const shareText =
    `${profileName} is learning on PyMaster.\n` +
    `XP: ${progress.xp.toLocaleString()} | Problems Solved: ${progress.solvedProblems.length} | Lessons: ${progress.completedLessons.length} | Streak: ${progress.streak} days | Stars: ${progress.starsCaught}` +
    (savedProfileBio ? `\nAbout: ${savedProfileBio}` : "");

  const handleShareDashboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: `${profileName}'s PyMaster Dashboard`,
          text: shareText,
          url: publicProfileUrl,
        });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${shareText}\n${publicProfileUrl}`);
        toast({
          title: "Dashboard copied",
          description: "Your dashboard summary and link are ready to paste.",
        });
        return;
      }

      toast({
        title: "Share not supported",
        description: "Your browser does not support sharing here yet.",
        variant: "destructive",
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast({
        title: "Share failed",
        description: "We couldn't share your dashboard right now.",
        variant: "destructive",
      });
    }
  };

  const handleCopyShareText = async () => {
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
        toast({
          title: "Copy not supported",
          description: "Your browser does not support clipboard copy here yet.",
          variant: "destructive",
        });
        return;
      }

      await navigator.clipboard.writeText(`${shareText}\n${publicProfileUrl}`);
      toast({
        title: "Copied to clipboard",
        description: "Your dashboard share text is ready to send.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "We couldn't copy your dashboard summary.",
        variant: "destructive",
      });
    }
  };

  const handleExportShareCard = async () => {
    const card = shareCardRef.current;
    if (!card) return;

    setExportingShareCard(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `${profileName.replace(/\s+/g, "_")}_pymaster_dashboard.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast({
        title: "Dashboard image ready",
        description: "Your share card has been exported as an image.",
      });
    } catch (error) {
      console.error("Dashboard export failed", error);
      toast({
        title: "Export failed",
        description: "We couldn't export your dashboard image.",
        variant: "destructive",
      });
    } finally {
      setExportingShareCard(false);
    }
  };

  const handleSaveProfileDetails = async () => {
    setSavingProfileDetails(true);
    try {
      const parsedSkills = draftSkillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
        .slice(0, 8);

      await saveProfile({
        displayName: profileName,
        bio: draftProfileBio,
        avatarUrl: profilePic,
        skills: parsedSkills,
        profileComplete: true,
      });

      localStorage.setItem("pymaster_social_links", JSON.stringify(draftSocialLinks));
      setSavedProfileBio(draftProfileBio);
      setSavedSkills(parsedSkills);
      setSavedSocialLinks(draftSocialLinks);
      setDraftSkillsInput(parsedSkills.join(", "));

      toast({
        title: "Profile updated",
        description: "Your bio, skills, and social links are saved.",
      });
    } catch (error) {
      toast({
        title: "Profile update failed",
        description: error instanceof Error ? error.message : "We couldn't save your profile details.",
        variant: "destructive",
      });
    } finally {
      setSavingProfileDetails(false);
    }
  };

  const stats = [
  { icon: Code, label: "Problems Solved", value: progress.solvedProblems.length, total: problems.length, color: "text-primary", emoji: "💻" },
  { icon: BookOpen, label: "Lessons Done", value: progress.completedLessons.length, total: lessons.length, color: "text-streak-green", emoji: "📚" },
  { icon: Clock, label: "Time Spent", value: formatTime(progress.timeSpent || 0), color: "text-blue-400", emoji: "⏱️" },
  { icon: Flame, label: "Streak", value: `${progress.streak}d`, color: "text-python-yellow", emoji: "🔥" },
  { icon: Zap, label: "Total XP", value: progress.xp.toLocaleString(), color: "text-expert-purple", emoji: "⚡" },
  { icon: Star, label: "Stars Caught", value: progress.starsCaught, color: "text-python-yellow", emoji: "⭐" }];


  const milestones = [
  { days: 1, title: "Python Beginner", emoji: "🐣" },
  { days: 7, title: "Python Explorer", emoji: "🧭" },
  { days: 30, title: "Dedicated Coder", emoji: "💻" },
  { days: 100, title: "Python Master", emoji: "🏆" }];


  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 rounded-none md:rounded-[2rem] ${selectedTheme.shell}`}>
      <div className="mb-6 rounded-2xl border border-border bg-card/80 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Dashboard View</span>
            {(["overview", "insights", "customize"] as const).map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setDashboardView(view)}
                className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  dashboardView === view ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface-1 text-muted-foreground"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setDashboardDensity((current) => (current === "full" ? "focus" : "full"))}
              className="rounded-full border border-border bg-surface-1 px-3 py-1 text-xs font-medium text-foreground"
            >
              {dashboardDensity === "focus" ? "Performance Mode On" : "Performance Mode Off"}
            </button>
            <div className="rounded-full border border-border bg-surface-1 px-3 py-1 text-xs font-medium text-muted-foreground">
              Streak resets in {streakResetLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 mb-6 md:mb-8">
        <div className="relative group">
          <Avatar className="w-20 h-20 border-2 border-primary/40 ring-4 ring-primary/10 shadow-xl shadow-primary/10">
            {profilePic ? <AvatarImage src={profilePic} alt="Profile" /> : null}
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 via-python-yellow/10 to-primary/10 text-primary">
              {selectedEmoji || trophy.emoji}
            </AvatarFallback>
          </Avatar>
          {selectedEmoji && (
            <span className="absolute -bottom-1 -right-1 text-lg bg-card border border-border rounded-full w-8 h-8 flex items-center justify-center shadow-md">
              {selectedEmoji}
            </span>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-background/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <Camera className="w-5 h-5 text-foreground" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePicUpload} className="hidden" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start w-full">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-surface-1 border border-border rounded-md px-2 py-1 text-lg font-bold text-foreground w-full max-w-[14rem]"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                />
                <Button size="sm" variant="ghost" onClick={saveName}>
                  <Check className="w-4 h-4 text-streak-green" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">
                  {profileName}
                  {selectedEmoji && <span className="ml-1">{selectedEmoji}</span>}
                </h1>
                <button onClick={() => {setEditingName(true);setNameInput(profileName);}}>
                  <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 flex-wrap">
            <StreakFire streak={progress.streak} size="sm" showQuote />
            <span className="text-sm text-muted-foreground">{title}</span>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Zap className="w-3.5 h-3.5" />
              Level {Math.floor(progress.xp / 500) + 1}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-python-yellow/10 text-python-yellow border border-python-yellow/20">
              {trophy.emoji} {trophy.title}
            </span>
          </div>
        </div>
      </div>

      <div className={`mb-6 md:mb-8 rounded-2xl md:rounded-3xl border p-4 sm:p-6 shadow-sm ${selectedTheme.hero}`}>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div ref={shareCardRef} className="rounded-2xl border border-white/50 bg-background/90 p-5 backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Public Profile</div>
                <h2 className="mt-2 text-2xl font-bold text-foreground">{profileName}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Shareable learner card with your rank, streak, XP, and progress highlights.
                </p>
              </div>
              <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Level {levelNumber}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card/80 p-3">
                <div className="text-xs text-muted-foreground">XP</div>
                <div className="mt-1 text-xl font-bold text-foreground">{progress.xp.toLocaleString()}</div>
              </div>
              <div className="rounded-xl border border-border bg-card/80 p-3">
                <div className="text-xs text-muted-foreground">Problems</div>
                <div className="mt-1 text-xl font-bold text-foreground">{progress.solvedProblems.length}</div>
              </div>
              <div className="rounded-xl border border-border bg-card/80 p-3">
                <div className="text-xs text-muted-foreground">Streak</div>
                <div className="mt-1 text-xl font-bold text-foreground">{progress.streak}d</div>
              </div>
              <div className="rounded-xl border border-border bg-card/80 p-3">
                <div className="text-xs text-muted-foreground">Stars</div>
                <div className="mt-1 text-xl font-bold text-foreground">{progress.starsCaught}</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {trophy.emoji} {trophy.title}
              </span>
              {certificateUnlocked && (
                <span className="rounded-full bg-streak-green/10 px-3 py-1 text-xs font-medium text-streak-green">
                  Certificate eligible
                </span>
              )}
              {yourRank && (
                <span className="rounded-full bg-python-yellow/10 px-3 py-1 text-xs font-medium text-python-yellow">
                  Rank #{yourRank.rank}
                </span>
              )}
            </div>
            {savedProfileBio && (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{savedProfileBio}</p>
            )}
            {savedSkillsView.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {savedSkillsView.map((skill) => (
                  <span key={skill} className="rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            )}
            {visibleSocialLinks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {visibleSocialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-background/90 p-5 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Palette className="w-4 h-4 text-primary" />
              Dashboard Upgrades
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {DASHBOARD_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setDashboardTheme(theme.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    dashboardTheme === theme.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-2">
              <Button type="button" className="w-full gap-2" onClick={handleShareDashboard}>
                <Share2 className="w-4 h-4" />
                Share Public Profile
              </Button>
              <Button type="button" variant="outline" className="w-full gap-2" onClick={handleCopyShareText}>
                <Copy className="w-4 h-4" />
                Copy Share Text
              </Button>
              <Button type="button" variant="outline" className="w-full gap-2" onClick={handleExportShareCard} disabled={exportingShareCard}>
                <Download className="w-4 h-4" />
                {exportingShareCard ? "Exporting..." : "Export Share Image"}
              </Button>
              <a href={publicProfileUrl} target="_blank" rel="noreferrer" className="inline-flex">
                <Button type="button" variant="ghost" className="w-full gap-2">
                  <ArrowUpRight className="w-4 h-4" />
                  Open Public Profile
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <SectionErrorBoundary section="Stats">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 md:mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-lg">{s.emoji}</span>
              </div>
              <div className="text-xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              {s.total && typeof s.value === "number" ? (
                <div className="mt-2 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min((s.value / s.total) * 100, 100)}%` }}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </SectionErrorBoundary>

      {/* Activity (moved below Public Profile) */}
      {(showOverview || showInsights) && dashboardDensity === "full" && (
      <SectionErrorBoundary section="Coding Activity">
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                📊 Coding Activity
              </h2>
              <p className="text-sm text-muted-foreground">
                Your consistency map for the last year, with stronger days glowing brighter.
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              {Object.keys(progress.activityMap).length} active days tracked
            </div>
          </div>
          <ActivityGraph activityMap={progress.activityMap} />
        </div>
      </SectionErrorBoundary>
      )}

      {/*
        <>
      Profile header (duplicate - removed)
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 mb-6 md:mb-8">
        <div className="relative group">
          <Avatar className="w-20 h-20 border-2 border-primary/40 ring-4 ring-primary/10 shadow-xl shadow-primary/10">
            {profilePic ? <AvatarImage src={profilePic} alt="Profile" /> : null}
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 via-python-yellow/10 to-primary/10 text-primary">
              {selectedEmoji || trophy.emoji}
            </AvatarFallback>
          </Avatar>
          {selectedEmoji &&
          <span className="absolute -bottom-1 -right-1 text-lg bg-card border border-border rounded-full w-8 h-8 flex items-center justify-center shadow-md">
              {selectedEmoji}
            </span>
          }
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-background/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            
            <Camera className="w-5 h-5 text-foreground" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePicUpload} className="hidden" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start w-full">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            {editingName ?
            <div className="flex items-center gap-2">
                <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="bg-surface-1 border border-border rounded-md px-2 py-1 text-lg font-bold text-foreground w-full max-w-[14rem]"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && saveName()} />
              
                <Button size="sm" variant="ghost" onClick={saveName}><Check className="w-4 h-4 text-streak-green" /></Button>
              </div> :

            <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">
                  {profileName}{selectedEmoji && <span className="ml-1">{selectedEmoji}</span>}
                </h1>
                <button onClick={() => {setEditingName(true);setNameInput(profileName);}}>
                  <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>
            }
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 flex-wrap">
            <StreakFire streak={progress.streak} size="sm" showQuote />
            <span className="text-sm text-muted-foreground">{title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              ⚡ Level {Math.floor(progress.xp / 500) + 1}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-python-yellow/10 text-python-yellow border border-python-yellow/20">
              {trophy.emoji} {trophy.title}
            </span>
          </div>
        </div>
      </div>
        </>
      */}

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Today Focus</div>
          <h2 className="mt-2 text-xl font-bold text-foreground">{nextFocusAction.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{nextFocusAction.helper}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button size="sm" className="gap-2" onClick={() => navigate(nextFocusAction.to)}>
              <Sparkles className="w-4 h-4" />
              {nextFocusAction.cta}
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/jobs")}>Browse Jobs</Button>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Quiz Insight</div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">All accuracy</span>
              <span className="font-semibold text-foreground">{quizAccuracy}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tricky accuracy</span>
              <span className="font-semibold text-foreground">{trickyAccuracy}%</span>
            </div>
            <div className="rounded-xl border border-border bg-surface-1 p-3 text-xs text-muted-foreground">
              {trickyAccuracy < quizAccuracy ? "Focus on tricky mode this week to raise interview readiness." : "Great consistency. Push overall volume for stronger confidence."}
            </div>
          </div>
        </div>
      </div>

      {(showInsights || showOverview) && (
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">Weekly Trend Snapshot</h3>
          <div className="mt-4 space-y-3">
            {weeklyTrendCards.map((trend) => {
              const trendPct = trend.previous > 0 ? Math.round(((trend.current - trend.previous) / trend.previous) * 100) : 100;
              const barWidth = Math.min(100, Math.max(8, Math.round((trend.current / Math.max(trend.current, trend.previous || 1)) * 100)));
              return (
                <div key={trend.label} className="rounded-xl border border-border bg-surface-1 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground">{trend.label}</span>
                    <span className={`text-xs font-semibold ${trendPct >= 0 ? "text-streak-green" : "text-destructive"}`}>
                      {trendPct >= 0 ? "+" : ""}{trendPct}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-background overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${barWidth}%` }} />
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{trend.helper}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">Achievement Timeline</h3>
          <div className="mt-4 space-y-3">
            {timelineItems.map((item, index) => (
              <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border bg-surface-1 p-3">
                <div className={`mt-0.5 text-xs font-bold ${item.tone}`}>#{index + 1}</div>
                <div>
                  <div className="text-sm font-medium text-foreground">{item.title}</div>
                  <div className="text-[11px] text-muted-foreground">{item.helper}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Quick actions */}
      {showOverview && (
      <SectionErrorBoundary section="Quick Actions">
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-python-yellow" />
                Quick Actions
              </h2>
              <p className="text-sm text-muted-foreground">
                Jump back into learning in one click. Great for all ages—pick one small next step and continue.
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              Tip: 15 minutes daily beats 2 hours once a week.
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {[
              { to: "/learn", title: "Learn", desc: "Continue lessons", icon: BookOpen, accent: "text-streak-green" },
              { to: "/problems", title: "Problems", desc: "Practice daily", icon: Code, accent: "text-primary" },
              { to: "/dsa", title: "DSA", desc: "Patterns + levels", icon: Brain, accent: "text-python-yellow" },
              { to: "/compiler", title: "Compiler", desc: "Try quick code", icon: Target, accent: "text-blue-400" },
              { to: "/blog", title: "Blog", desc: "Read guides", icon: Globe, accent: "text-expert-purple" },
              { to: "/projects", title: "Projects", desc: "See how it’s built", icon: Award, accent: "text-python-yellow" },
            ].map((item) => (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                className="rounded-xl border border-border bg-surface-1 p-4 text-left hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`rounded-lg border border-border bg-background p-2 ${item.accent}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="mt-3 text-sm font-semibold text-foreground">{item.title}</div>
                <div className="mt-1 text-[11px] leading-5 text-muted-foreground">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </SectionErrorBoundary>
      )}

      <div className={`grid gap-6 xl:grid-cols-[1.1fr_0.9fr] mb-8 ${showCustomize ? "" : "hidden"}`}>
        <SectionErrorBoundary section="Profile Editor">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-primary" />
                  Edit Profile
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Keep your public card fresh with a bio, skill tags, and your main links.
                </p>
              </div>
              <Button type="button" size="sm" className="gap-2" onClick={handleSaveProfileDetails} disabled={savingProfileDetails}>
                <Save className="w-4 h-4" />
                {savingProfileDetails ? "Saving..." : "Save"}
              </Button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Bio</label>
                <textarea
                  value={draftProfileBio}
                  onChange={(event) => setDraftProfileBio(event.target.value.slice(0, 180))}
                  className="mt-2 min-h-[96px] w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="Tell people what you are learning, building, or aiming for."
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">{draftProfileBio.length}/180</div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Skills</label>
                <input
                  value={draftSkillsInput}
                  onChange={(event) => setDraftSkillsInput(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="Python, Flask, Pandas, APIs"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {draftSkillsParsed.length > 0 ? draftSkillsParsed.map((skill) => (
                    <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {skill}
                    </span>
                  )) : (
                    <span className="text-xs text-muted-foreground">Comma-separated skills will appear here.</span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-foreground">GitHub</label>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-3 py-2.5">
                    <Github className="w-4 h-4 text-muted-foreground" />
                    <input
                      value={draftSocialLinks.github}
                      onChange={(event) => setDraftSocialLinks((current) => ({ ...current, github: event.target.value }))}
                      className="w-full bg-transparent text-sm text-foreground outline-none"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">LinkedIn</label>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-3 py-2.5">
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                    <input
                      value={draftSocialLinks.linkedin}
                      onChange={(event) => setDraftSocialLinks((current) => ({ ...current, linkedin: event.target.value }))}
                      className="w-full bg-transparent text-sm text-foreground outline-none"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Portfolio</label>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-3 py-2.5">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <input
                      value={draftSocialLinks.portfolio}
                      onChange={(event) => setDraftSocialLinks((current) => ({ ...current, portfolio: event.target.value }))}
                      className="w-full bg-transparent text-sm text-foreground outline-none"
                      placeholder="https://your-site.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary section="Time Gift">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Time Gift Countdown
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Stay on the platform and PyMaster drops a wallet gift every 10 minutes.
            </p>

            <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-primary">Next Gift</div>
              <div className="mt-2 text-4xl font-bold text-foreground">{formatCountdown(secondsUntilGift)}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Hourly gift #{nextGiftAtHours} unlocks with a <span className="font-semibold text-foreground">+$5 wallet bonus</span>.
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${((TIME_GIFT_INTERVAL_SECONDS - secondsUntilGift) / TIME_GIFT_INTERVAL_SECONDS) * 100}%` }}
                />
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Time tracked so far: <span className="font-semibold text-foreground">{formatTime(liveTimeSpent)}</span>
              </div>
            </div>
          </div>
        </SectionErrorBoundary>
      </div>

      {/* Streak Recovery Banner */}
      {(showInsights || showOverview) && canRecover &&
      <div className="mb-6 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-yellow-500/10 border border-orange-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <p className="text-sm font-semibold text-foreground">Your {progress.previousStreak}-day streak was broken!</p>
              <p className="text-xs text-muted-foreground">Restore it now before it's too late. Cost: <span className="font-bold text-python-yellow">${recoveryCost}</span></p>
            </div>
          </div>
          <Button
          size="sm"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white gap-1.5 shrink-0"
          onClick={attemptStreakRecovery}
          disabled={progress.wallet < recoveryCost}>
          
            <Flame className="w-4 h-4" />
            {progress.wallet < recoveryCost ? `Need $${recoveryCost - progress.wallet} more` : `Restore Streak — $${recoveryCost}`}
          </Button>
        </div>
      }

      <div className={`grid gap-6 xl:grid-cols-[1.1fr_0.9fr] mb-8 ${(showInsights || showOverview) ? "" : "hidden"}`}>
        <SectionErrorBoundary section="Rank Card">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Medal className="w-5 h-5 text-primary" />
                  Rank Card
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your current level, public standing, and next XP milestone.
                </p>
              </div>
              {yourRank && (
                <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  #{yourRank.rank}
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-surface-1 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current Level</div>
                <div className="mt-2 text-3xl font-bold text-foreground">{levelNumber}</div>
                <div className="mt-1 text-sm text-muted-foreground">{title}</div>
              </div>
              <div className="rounded-xl border border-border bg-surface-1 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Progress</div>
                <div className="mt-2 text-3xl font-bold text-foreground">{solvedPct}%</div>
                <div className="mt-1 text-sm text-muted-foreground">{lessonPct}% lessons completed</div>
              </div>
              <div className="rounded-xl border border-border bg-surface-1 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Next Level</div>
                <div className="mt-2 text-3xl font-bold text-foreground">{xpToNextLevel}</div>
                <div className="mt-1 text-sm text-muted-foreground">XP left to reach Level {levelNumber + 1}</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Level progress</span>
                <span>{xpIntoLevel}/500 XP</span>
              </div>
              <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(xpIntoLevel / 500) * 100}%` }} />
              </div>
            </div>
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary section="Certificate Status">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-python-yellow" />
              Certificate Shortcut
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Track certificate readiness from the dashboard without opening the certificate page first.
            </p>
            <div className="mt-5 rounded-2xl border border-border bg-surface-1 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {certificateUnlocked ? "Certificate unlocked" : "Keep going to unlock"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {certificateUnlocked ? "You have reached the 100 XP qualification mark." : `You need ${Math.max(100 - progress.xp, 0)} more XP to qualify.`}
                  </div>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-semibold ${certificateUnlocked ? "bg-streak-green/10 text-streak-green" : "bg-primary/10 text-primary"}`}>
                  {certificateUnlocked ? "Eligible" : "In Progress"}
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-background overflow-hidden">
                <div className="h-full rounded-full bg-python-yellow" style={{ width: `${Math.min(progress.xp / 100 * 100, 100)}%` }} />
              </div>
              <div className="mt-4">
                <Link to="/certificate" className="inline-flex">
                  <Button size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Open Certificate Page
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SectionErrorBoundary>
      </div>

      <div className={`grid gap-6 lg:grid-cols-2 mb-8 ${(showInsights || showOverview) ? "" : "hidden"}`}>
        <SectionErrorBoundary section="Quiz Progress">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CircleHelp className="w-5 h-5 text-primary" />
              Quiz Progress
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Track your Python quiz progress across all questions and tricky mode.
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-border bg-surface-1 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-foreground">All Questions</div>
                  <div className="text-xs text-muted-foreground">
                    {quizProgress.allAnswered}/{quizProgress.allTotal} answered • {quizProgress.allScore} correct
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-background overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${allQuizAnsweredPct}%` }} />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface-1 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-foreground">Tricky Only</div>
                  <div className="text-xs text-muted-foreground">
                    {quizProgress.trickyAnswered}/{quizProgress.trickyTotal} answered • {quizProgress.trickyScore} correct
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-background overflow-hidden">
                  <div className="h-full rounded-full bg-python-yellow transition-all" style={{ width: `${trickyQuizAnsweredPct}%` }} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link to="/python-quiz-100" className="inline-flex">
                  <Button size="sm" className="gap-2">
                    <CircleHelp className="w-4 h-4" />
                    Continue Quiz
                  </Button>
                </Link>
                <Link to="/learn" className="inline-flex">
                  <Button size="sm" variant="outline">
                    Revise Lessons
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary section="Weekly Goals">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Weekly Goals
              </h2>
              <div className="flex items-center gap-2">
                {(["steady", "focused", "sprint"] as const).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setGoalPreset(preset)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                      goalPreset === preset ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface-1 text-muted-foreground"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {weeklyGoals.map((goal) => {
                const pct = Math.min(goal.current / goal.target * 100, 100);
                return (
                  <div key={goal.label} className="rounded-xl border border-border bg-surface-1 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{goal.label}</div>
                        <div className="text-xs text-muted-foreground">{goal.helper}</div>
                      </div>
                      <div className="text-sm font-semibold text-primary">{goal.current}/{goal.target}</div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-background overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary section="Achievement Showcase">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Crown className="w-5 h-5 text-python-yellow" />
              Achievement Showcase
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {showcaseItems.length > 0 ? showcaseItems.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-surface-1 p-4 text-center">
                  <div className="text-3xl">{item.emoji}</div>
                  <div className="mt-2 text-sm font-semibold text-foreground">{item.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{item.helper}</div>
                </div>
              )) : (
                <div className="rounded-xl border border-dashed border-border bg-surface-1 p-4 text-sm text-muted-foreground sm:col-span-3">
                  Your first showcase items will appear here as you build streaks, earn stars, and unlock the certificate.
                </div>
              )}
            </div>
          </div>
        </SectionErrorBoundary>
      </div>

      <div className={`grid gap-6 xl:grid-cols-[1fr_1fr_1fr] mb-8 ${showInsights ? "" : "hidden"}`}>
        <SectionErrorBoundary section="Recent Activity">
          <div className="bg-card border border-border rounded-2xl p-6 h-full">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
            <div className="mt-5 space-y-3">
              {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-surface-1 p-3">
                  <CheckCircle2 className="w-4 h-4 text-streak-green mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              )) : (
                <div className="rounded-xl border border-dashed border-border bg-surface-1 p-4 text-sm text-muted-foreground">
                  Start solving, learning, or coding to build your activity history.
                </div>
              )}
            </div>
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary section="Friends Compare">
          <div className="bg-card border border-border rounded-2xl p-6 h-full">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-python-yellow" />
              Compare Nearby
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              See how you stack up against nearby learners on the leaderboard.
            </p>
            <div className="mt-5 space-y-3">
              {compareWindow.length > 0 ? compareWindow.map((entry) => {
                const isYou = entry.user_id === user?.uid;
                return (
                  <div key={`${entry.user_id}-${entry.rank}`} className={`rounded-xl border p-4 ${isYou ? "border-primary bg-primary/5" : "border-border bg-surface-1"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-foreground">#{entry.rank} {entry.display_name}</div>
                        <div className="text-xs text-muted-foreground">{entry.solved_count} solved • {entry.streak} day streak</div>
                      </div>
                      <div className="text-sm font-bold text-primary">{entry.xp.toLocaleString()} XP</div>
                    </div>
                  </div>
                );
              }) : (
                <div className="rounded-xl border border-dashed border-border bg-surface-1 p-4 text-sm text-muted-foreground">
                  Leaderboard comparisons will appear here once ranking data is available.
                </div>
              )}
            </div>
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary section="Heatmap Insights">
          <div className="bg-card border border-border rounded-2xl p-6 h-full">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Flame className="w-5 h-5 text-python-yellow" />
              Heatmap Insights
            </h2>
            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-border bg-surface-1 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Active Days</div>
                <div className="mt-1 text-2xl font-bold text-foreground">{activeDays.length}</div>
                <div className="text-sm text-muted-foreground">Days tracked in your coding graph</div>
              </div>
              <div className="rounded-xl border border-border bg-surface-1 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Strongest Day</div>
                <div className="mt-1 text-sm font-semibold text-foreground">
                  {strongestDay ? `${strongestDay[0]} with ${strongestDay[1]} activity hits` : "No activity yet"}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-surface-1 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Momentum</div>
                <div className="mt-1 text-sm font-semibold text-foreground">
                  {progress.streak >= 7 ? "You are in a strong consistency run." : "A 7-day streak will unlock stronger momentum."}
                </div>
              </div>
            </div>
          </div>
        </SectionErrorBoundary>
      </div>

      {/* How to Climb */}
      {showOverview && (
      <SectionErrorBoundary section="How to Climb">
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            🧗 How to Climb
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {howToClimb.map((item) =>
            <button
              key={item.title}
              onClick={() => navigate(item.link)}
              className="rounded-lg p-4 text-center border border-border bg-surface-1 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 cursor-pointer group">
              
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.emoji}</div>
                <div className="text-sm font-semibold text-foreground">{item.title}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{item.desc}</div>
              </button>
            )}
          </div>
        </div>
      </SectionErrorBoundary>
      )}

      {/* Emoji Shop */}
      {showCustomize && (
      <SectionErrorBoundary section="Emoji Shop">
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            🛒 Emoji Shop
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Buy emojis to customize your profile! Balance: <span className="text-reward-gold font-bold">${progress.wallet}</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-3">
            {EMOJI_SHOP.filter((i) => !i.legendary).map((item) => {
              const owned = purchasedEmojis.includes(item.emoji);
              const equipped = selectedEmoji === item.emoji;
              return (
                <button
                  key={item.emoji}
                  onClick={() => buyEmoji(item.emoji, item.price)}
                  className={`rounded-lg p-3 text-center border transition-all duration-200 hover:scale-105 ${
                  equipped ?
                  "bg-primary/15 border-primary/50 ring-2 ring-primary/30" :
                  owned ?
                  "bg-streak-green/10 border-streak-green/30" :
                  "bg-surface-1 border-border hover:border-primary/30"}`
                  }>
                  
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <div className="text-[10px] font-medium text-foreground truncate">{item.name}</div>
                  {owned ?
                  <div className="text-[10px] text-streak-green font-semibold mt-0.5">
                      {equipped ? "✅ Equipped" : "Owned"}
                    </div> :

                  <div className="text-[10px] text-reward-gold font-semibold mt-0.5">${item.price}</div>
                  }
                </button>);

            })}
          </div>
          {/* Legendary Item */}
          {EMOJI_SHOP.filter((i) => i.legendary).map((item) => {
            const owned = purchasedEmojis.includes(item.emoji);
            const equipped = selectedEmoji === item.emoji;
            return (
              <button
                key={item.emoji}
                onClick={() => buyEmoji(item.emoji, item.price)}
                className={`w-full rounded-xl p-4 sm:p-5 border-2 transition-all duration-300 relative overflow-hidden text-left ${
                equipped ?
                "border-python-yellow bg-python-yellow/15 ring-4 ring-python-yellow/40 shadow-lg shadow-python-yellow/20" :
                owned ?
                "border-streak-green bg-streak-green/10 ring-2 ring-streak-green/30" :
                "border-python-yellow/60 bg-gradient-to-r from-python-yellow/5 via-reward-gold/5 to-python-yellow/5 hover:from-python-yellow/10 hover:to-reward-gold/10 animate-pulse"}`
                }>
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                  <div className="text-5xl sm:text-6xl drop-shadow-lg">{item.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-lg font-extrabold text-python-yellow">{item.name}</span>
                      <span className="text-[10px] font-bold bg-python-yellow text-background px-2 py-0.5 rounded-full uppercase tracking-wider">✨ Legendary</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">The ultimate badge — only for true Python Gods who rule the leaderboard</div>
                    {owned ?
                    <div className="text-sm text-streak-green font-bold">{equipped ? "✅ Equipped — You are a Legend" : "✅ Owned — Click to Equip"}</div> :

                    <div className="text-base font-extrabold text-python-yellow">💰 $5,000</div>
                    }
                  </div>
                </div>
              </button>);

          })}
        </div>
      </SectionErrorBoundary>
      )}

      {/* Star Trophy Progress */}
      {showInsights && dashboardDensity === "full" && (
      <SectionErrorBoundary section="Star Trophies">
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex flex-col mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
              <Trophy className="w-6 h-6 text-python-yellow" />
              Trophy Hall
            </h2>
            <p className="text-sm text-muted-foreground">
              Catch shooting stars on the home page to earn legendary trophies! You've caught <span className="text-python-yellow font-bold">{progress.starsCaught}</span> stars.
              {trophy.next > 0 && <> Next trophy at <span className="text-foreground font-bold">{trophy.next}</span> stars.</>}
            </p>
          </div>
          <TrophyHall starsCaught={progress.starsCaught} />
        </div>
      </SectionErrorBoundary>
      )}

      {/* Streak Milestones */}
      {(showInsights || showOverview) && (
      <SectionErrorBoundary section="Streak Milestones">
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            🔥 Streak Milestones
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {milestones.map((m) => {
              const achieved = progress.streak >= m.days;
              return (
                <div key={m.days} className={`rounded-lg p-4 text-center border transition-all duration-300 ${achieved ? "bg-streak-green/10 border-streak-green/30 scale-105" : "bg-surface-1 border-border opacity-50"}`}>
                  <div className="text-2xl mb-1">{m.emoji}</div>
                  <div className="text-sm font-medium text-foreground">{m.title}</div>
                  <div className="text-xs text-muted-foreground">{m.days} day{m.days > 1 ? "s" : ""}</div>
                  {achieved && <div className="text-[10px] text-streak-green mt-1">✅</div>}
                </div>);

            })}
          </div>
        </div>
      </SectionErrorBoundary>
      )}

      {/* Completion Badges */}
      {showInsights && (
      <SectionErrorBoundary section="Badges">
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <BadgeDisplay />
        </div>
      </SectionErrorBoundary>
      )}

      {/* Solved Problems */}
      {showOverview && dashboardDensity === "full" && (
      <SectionErrorBoundary section="Solved Problems">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            💻 Solved Problems
          </h2>
          {progress.solvedProblems.length === 0 ?
          <p className="text-sm text-muted-foreground">No problems solved yet. <Link to="/problems" className="text-primary hover:underline">🚀 Start your first challenge!</Link></p> :

          <div className="space-y-2">
              {progress.solvedProblems.map((pid) => {
              const p = problems.find((pr) => pr.id === pid);
              if (!p) return null;
              return (
                <div key={pid} className="flex items-center gap-3 text-sm">
                    <span className="text-streak-green">✅</span>
                    <span className="text-foreground">{p.title}</span>
                    <span className="text-xs text-muted-foreground capitalize">({p.difficulty})</span>
                  </div>);

            })}
            </div>
          }
        </div>
      </SectionErrorBoundary>
      )}
    </div>);

}
