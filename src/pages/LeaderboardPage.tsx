// ============================================================
// LEADERBOARD PAGE — src/pages/LeaderboardPage.tsx
// Displays a competitive leaderboard with sortable columns,
// trophy tiers, and the current user highlighted.
// ============================================================
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Flame, Code, Wallet, Medal, Crown, Award, Star, Lock } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { getTrophyForStars } from "@/lib/progress";

type SortKey = "xp" | "problemsSolved" | "streak" | "wallet";

interface LeaderboardUser {
  userId?: string;
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  problemsSolved: number;
  streak: number;
  wallet: number;
  emoji?: string;
  isYou?: boolean;
}

interface LeaderboardRow {
  user_id: string;
  display_name: string;
  xp: number;
  solved_count: number;
  streak: number;
  wallet: number;
}

// Trophy tier definitions with thresholds (8 tiers)
const trophyTiers = [
  { emoji: "🐍", title: "Python Trophy", minStars: 2000, color: "text-streak-green", bg: "bg-streak-green/10 border-streak-green/30", desc: "Catch 2000 stars", legendary: true },
  { emoji: "🐉", title: "Dragon Master", minStars: 1000, color: "text-destructive", bg: "bg-destructive/10 border-destructive/30", desc: "Catch 1000 stars" },
  { emoji: "👑", title: "Legendary Crown", minStars: 500, color: "text-streak-green", bg: "bg-streak-green/10 border-streak-green/30", desc: "Catch 500 stars" },
  { emoji: "🌟", title: "Supernova", minStars: 350, color: "text-expert-purple", bg: "bg-expert-purple/10 border-expert-purple/30", desc: "Catch 350 stars" },
  { emoji: "💎", title: "Diamond", minStars: 200, color: "text-primary", bg: "bg-primary/10 border-primary/30", desc: "Catch 200 stars" },
  { emoji: "🏆", title: "Gold", minStars: 100, color: "text-python-yellow", bg: "bg-python-yellow/10 border-python-yellow/30", desc: "Catch 100 stars" },
  { emoji: "🥈", title: "Silver", minStars: 50, color: "text-muted-foreground", bg: "bg-muted/10 border-muted-foreground/30", desc: "Catch 50 stars" },
  { emoji: "🥉", title: "Bronze", minStars: 20, color: "text-reward-gold", bg: "bg-reward-gold/10 border-reward-gold/30", desc: "Catch 20 stars" },
];

const rankIcons: Record<number, React.ReactNode> = {
  1: <Crown className="w-5 h-5 text-python-yellow" />,
  2: <Medal className="w-5 h-5 text-muted-foreground" />,
  3: <Award className="w-5 h-5 text-reward-gold" />,
};

const rankBg: Record<number, string> = {
  1: "bg-python-yellow/5 border-python-yellow/20",
  2: "bg-muted/30 border-muted-foreground/20",
  3: "bg-reward-gold/5 border-reward-gold/20",
};

export default function LeaderboardPage() {
  const { progress } = useProgress();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortKey>("xp");
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Memoize user trophy to prevent unnecessary recalculations
  const userTrophy = getTrophyForStars(progress?.starsCaught || 0);
  const userEquippedEmoji = typeof localStorage !== "undefined" ? (localStorage.getItem("pymaster_selected_emoji") || "") : "";

  useEffect(() => {
    let active = true;
    setLoading(true);

    supabase.rpc("get_leaderboard").then(({ data, error }) => {
      if (!active) return;

      if (error) {
        console.error("Leaderboard load failed", error);
        setUsers([]);
        setLoading(false);
        return;
      }

        const nextUsers = ((data || []) as LeaderboardRow[]).map((row) => ({
          userId: row.user_id,
          rank: 0,
          name: row.display_name,
          avatar: row.display_name.slice(0, 2).toUpperCase(),
          xp: row.xp,
          problemsSolved: row.solved_count,
          streak: row.streak,
        wallet: row.wallet,
        emoji: row.user_id === user?.uid ? userEquippedEmoji : undefined,
        isYou: row.user_id === user?.uid,
      }));

      setUsers(nextUsers);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [user?.uid, userEquippedEmoji]);

  const allUsers = useMemo(() => {
    const fallbackName = profile?.displayName || localStorage.getItem("pymaster_name") || "You";
    const currentUserEntry: LeaderboardUser = {
      userId: user?.uid,
      rank: 0,
      name: fallbackName,
      avatar: profile?.avatarUrl || fallbackName.slice(0, 2).toUpperCase(),
      xp: progress?.xp || 0,
      problemsSolved: progress?.solvedProblems?.length || 0,
      streak: progress?.streak || 0,
      wallet: progress?.wallet || 0,
      emoji: userEquippedEmoji,
      isYou: true,
    };

    const sourceUsers = user
      ? [currentUserEntry, ...users.filter((entry) => entry.userId !== user.uid)]
      : users;

    return [...sourceUsers]
      .sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number))
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  }, [profile?.avatarUrl, profile?.displayName, progress?.solvedProblems?.length, progress?.streak, progress?.wallet, progress?.xp, sortBy, user, userEquippedEmoji, users]);

  const sortOptions: { key: SortKey; label: string; icon: typeof Trophy }[] = [
    { key: "xp", label: "XP", icon: Trophy },
    { key: "problemsSolved", label: "Problems", icon: Code },
    { key: "streak", label: "Streak", icon: Flame },
    { key: "wallet", label: "Wallet", icon: Wallet },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-6 h-6 text-python-yellow" /> Leaderboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Loading real rankings..." : "Live rankings from real learner profiles"}
          </p>
        </div>
        <div className="flex gap-1.5 bg-surface-1 border border-border rounded-lg p-1 overflow-x-auto scrollbar-none">
          {sortOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                sortBy === opt.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <opt.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trophy Tiers - Aspiration Section */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Star className="w-5 h-5 text-python-yellow fill-python-yellow" /> Trophy Tiers
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          You have <span className="text-python-yellow font-bold">{progress.starsCaught}</span> stars — 
          Current tier: <span className="font-bold text-foreground">{userTrophy.emoji} {userTrophy.title}</span>
          {userTrophy.next > 0 && <> • Next at <span className="text-primary font-bold">{userTrophy.next}</span> stars</>}
        </p>
        {/* Python Trophy - legendary full-width banner */}
        {(() => {
          const pythonTier = trophyTiers[0];
          const achieved = progress.starsCaught >= pythonTier.minStars;
          const progressPct = Math.min((progress.starsCaught / pythonTier.minStars) * 100, 100);
          return (
            <div className={`relative rounded-xl p-4 border mb-3 transition-all duration-300 overflow-hidden ${
              achieved
                ? "bg-streak-green/10 border-streak-green ring-2 ring-streak-green/50"
                : "bg-surface-1 border-border"
            }`}>
              {achieved && <div className="absolute inset-0 bg-gradient-to-r from-streak-green/5 via-python-yellow/5 to-streak-green/5 animate-pulse pointer-events-none" />}
              <div className="relative flex items-center gap-4">
                <div className={`text-5xl ${achieved ? "animate-bounce" : "grayscale opacity-40"}`}>🐍</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-base font-extrabold ${achieved ? "text-streak-green" : "text-muted-foreground"}`}>Python Trophy</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-streak-green/20 text-streak-green border border-streak-green/40 uppercase tracking-wider">Ultimate</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">The highest honour — catch 2000 stars to become a true Python Master</div>
                  <div className="mt-2 h-2 bg-surface-2 rounded-full overflow-hidden w-full max-w-xs">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${achieved ? "bg-streak-green" : "bg-primary/60"}`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {achieved ? "✅ Achieved — You are a Python Master!" : `${progress.starsCaught} / 2000 stars`}
                  </div>
                </div>
                {!achieved && <Lock className="w-5 h-5 text-muted-foreground/40 shrink-0" />}
              </div>
            </div>
          );
        })()}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {trophyTiers.slice(1).map(tier => {
            const achieved = progress.starsCaught >= tier.minStars;
            const progressPct = Math.min((progress.starsCaught / tier.minStars) * 100, 100);
            return (
              <div
                key={tier.title}
                className={`relative rounded-xl p-5 text-center border transition-all duration-300 ${
                  achieved
                    ? `${tier.bg} ring-2 ring-offset-1 ring-offset-background ring-primary/40 scale-[1.03]`
                    : "bg-surface-1 border-border"
                }`}
              >
                {!achieved && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />
                  </div>
                )}
                <div className={`text-4xl mb-2 ${achieved ? "" : "grayscale opacity-40"}`}>{tier.emoji}</div>
                <div className={`text-sm font-bold ${achieved ? tier.color : "text-muted-foreground"}`}>{tier.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{tier.desc}</div>
                <div className="mt-3 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${achieved ? "bg-streak-green" : "bg-primary/60"}`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {achieved ? "✅ Achieved" : `${progress.starsCaught}/${tier.minStars}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Leader Spotlight */}
      {(() => {
        const activeLeader = allUsers[0];
        const activeSortLabel = sortOptions.find(o => o.key === sortBy)?.label;
        return (
          <div
            key={sortBy}
            className="bg-card border border-border rounded-xl p-6 mb-8 relative overflow-hidden group shadow-sm transition-opacity duration-300"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-700 ease-out group-hover:scale-110 pointer-events-none" />
            <div className="flex items-center gap-5 sm:gap-6 relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-2xl sm:text-3xl font-bold text-primary-foreground shrink-0 shadow-lg shadow-primary/30 ring-4 ring-primary/20">
                {activeLeader.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] sm:text-xs font-bold text-primary-foreground bg-primary px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Top {activeSortLabel}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground truncate mt-1">
                  {activeLeader.name} {activeLeader.isYou && <span className="text-sm font-bold text-python-yellow ml-2 bg-python-yellow/10 px-2 py-0.5 rounded-full">It's You!</span>}
                </h2>
                <div className="text-muted-foreground mt-1.5 font-medium flex items-center gap-2">
                  <span className="text-foreground text-lg sm:text-xl font-bold font-mono bg-surface-2 px-2 py-0.5 rounded-md">
                    {activeLeader[sortBy]}
                  </span>
                  {sortBy === "streak" && "🔥 Daily Streak"}
                  {sortBy === "xp" && "XP Earned"}
                  {sortBy === "problemsSolved" && "Problems Solved"}
                  {sortBy === "wallet" && "Coins in Wallet"}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Your Stats Card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-8 relative z-10">
        {/* Mobile card view */}
        <div className="sm:hidden">
          {allUsers.map(user => (
            <div key={`mobile-${user.rank}`} className={`p-4 mb-3 rounded-xl border transition-all duration-200 ${user.isYou ? "bg-primary/20 border-primary shadow-sm shadow-primary/20" : "bg-primary/5 border-transparent"}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-primary text-primary-foreground">
                  {user.avatar}
                </div>
                <div>
                  <span className="text-sm font-bold text-primary">{user.name}{user.emoji && ` ${user.emoji}`}{user.isYou && ` ${userTrophy.emoji}`}</span>
                  <div className="text-xs text-muted-foreground">Rank #{user.rank}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-surface-1 rounded-lg p-2.5 text-center">
                  <div className={`text-sm font-mono font-semibold ${sortBy === "xp" ? "text-primary" : "text-foreground"}`}>{user.xp.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground">XP</div>
                </div>
                <div className="bg-surface-1 rounded-lg p-2.5 text-center">
                  <div className={`text-sm font-mono font-semibold ${sortBy === "problemsSolved" ? "text-primary" : "text-foreground"}`}>{user.problemsSolved}</div>
                  <div className="text-[10px] text-muted-foreground">Solved</div>
                </div>
                <div className="bg-surface-1 rounded-lg p-2.5 text-center">
                  <div className={`text-sm font-mono font-semibold ${sortBy === "streak" ? "text-primary" : "text-foreground"}`}>{user.streak}🔥</div>
                  <div className="text-[10px] text-muted-foreground">Streak</div>
                </div>
                <div className="bg-surface-1 rounded-lg p-2.5 text-center">
                  <div className={`text-sm font-mono font-semibold ${sortBy === "wallet" ? "text-primary" : "text-foreground"}`}>${user.wallet}</div>
                  <div className="text-[10px] text-muted-foreground">Wallet</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Desktop table view */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-[3rem_1fr_6rem_6rem_6rem_6rem] gap-2 px-4 py-2.5 border-b border-border bg-surface-1 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            <span>#</span>
            <span>User</span>
            <span className="text-right">XP</span>
            <span className="text-right">Solved</span>
            <span className="text-right">Streak</span>
            <span className="text-right">Wallet</span>
          </div>
          {allUsers.map(user => (
            <div
              key={`desktop-${user.rank}`}
              className={`grid grid-cols-[3rem_1fr_6rem_6rem_6rem_6rem] gap-2 px-4 py-3 border-b items-center transition-colors duration-200 ${
                user.isYou ? "bg-primary/15 border-primary shadow-sm relative z-10" : "bg-primary/5 border-border last:border-0"
              }`}
            >
            <span className="text-sm font-medium text-muted-foreground">
              {rankIcons[user.rank] || user.rank}
            </span>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-primary text-primary-foreground">
                {user.avatar}
              </div>
              <span className="text-sm font-bold text-primary truncate">
                {user.name}{user.emoji && ` ${user.emoji}`}{user.isYou && ` ${userTrophy.emoji}`}
              </span>
            </div>
            <span className={`text-sm text-right font-mono ${sortBy === "xp" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              {user.xp.toLocaleString()}
            </span>
            <span className={`text-sm text-right font-mono ${sortBy === "problemsSolved" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              {user.problemsSolved}
            </span>
            <span className={`text-sm text-right font-mono ${sortBy === "streak" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              {user.streak}🔥
            </span>
            <span className={`text-sm text-right font-mono ${sortBy === "wallet" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              ${user.wallet}
            </span>
          </div>
        ))}
        </div>
      </div>

      {/* How to climb */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">🚀 How to Climb</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { emoji: "💻", title: "Solve Problems", desc: "Earn $5–$100 per problem based on difficulty", link: "/problems" },
            { emoji: "🔥", title: "Build Streaks", desc: "Code daily to increase your streak counter", link: "/compiler" },
            { emoji: "⭐", title: "Catch Stars", desc: "Answer riddles on the home page to unlock trophies", link: "/" },
            { emoji: "📚", title: "Complete Lessons", desc: "Finish exercises to earn +25 XP and $5 each", link: "/learn" },
          ].map(item => (
            <button
              key={item.title}
              onClick={() => navigate(item.link)}
              className="flex items-start gap-3 p-3 rounded-lg bg-surface-1 border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 text-left group cursor-pointer w-full"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.emoji}</span>
              <div>
                <div className="font-medium text-foreground">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
