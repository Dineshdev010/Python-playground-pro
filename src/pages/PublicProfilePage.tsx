import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Trophy, Flame, Code, Wallet, ArrowLeft, Share2, Copy, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/contexts/ProgressContext";
import { getStreakTitle } from "@/lib/progress";

type PublicProfileRow = {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  xp: number;
  solved_count: number;
  streak: number;
  wallet: number;
};

export default function PublicProfilePage() {
  const { userId } = useParams();
  const { user, profile } = useAuth();
  const { progress } = useProgress();
  const { toast } = useToast();
  const [entry, setEntry] = useState<PublicProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    supabase.rpc("get_leaderboard").then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error("Public profile load failed", error);
        setEntry(null);
        setLoading(false);
        return;
      }

      const rows = (data || []) as PublicProfileRow[];
      const leaderboardEntry = rows.find((row) => row.user_id === userId) || null;

      if (!leaderboardEntry && user?.uid === userId) {
        setEntry({
          user_id: user.uid,
          display_name: profile?.displayName || localStorage.getItem("pymaster_name") || "Python Learner",
          avatar_url: profile?.avatarUrl || localStorage.getItem("pymaster_avatar") || "",
          xp: progress.xp,
          solved_count: progress.solvedProblems.length,
          streak: progress.streak,
          wallet: progress.wallet,
        });
      } else {
        setEntry(leaderboardEntry);
      }

      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [profile?.avatarUrl, profile?.displayName, progress.solvedProblems.length, progress.streak, progress.wallet, progress.xp, user?.uid, userId]);

  const publicUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = useMemo(() => {
    if (!entry) return "";
    return `${entry.display_name}'s PyMaster profile\nXP: ${entry.xp.toLocaleString()} • Problems: ${entry.solved_count} • Streak: ${entry.streak} days`;
  }, [entry]);

  const handleShare = async () => {
    if (!entry) return;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: `${entry.display_name}'s PyMaster Profile`, text: shareText, url: publicUrl });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${shareText}\n${publicUrl}`);
        toast({ title: "Profile copied", description: "The public profile link is ready to share." });
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast({ title: "Share failed", description: "We couldn't share this public profile.", variant: "destructive" });
    }
  };

  const streakTitle = entry ? getStreakTitle(entry.streak) : "Learner";
  const level = entry ? Math.floor(entry.xp / 500) + 1 : 1;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 text-center">
          <div className="text-lg font-semibold text-foreground">Loading public profile...</div>
          <div className="mt-2 text-sm text-muted-foreground">Fetching the latest learner stats.</div>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 text-center">
          <div className="text-2xl font-bold text-foreground">Profile not found</div>
          <div className="mt-2 text-sm text-muted-foreground">
            This learner profile is not available on the public leaderboard right now.
          </div>
          <Link to="/" className="inline-flex mt-5">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-background via-background to-primary/5 p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              {entry.avatar_url ? <AvatarImage src={entry.avatar_url} alt={entry.display_name} /> : null}
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {entry.display_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Public PyMaster Profile</div>
              <h1 className="mt-2 text-3xl font-bold text-foreground">{entry.display_name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Level {level}</span>
                <span className="rounded-full bg-python-yellow/10 px-3 py-1 text-xs font-medium text-python-yellow">{streakTitle}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" className="gap-2" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={async () => {
                if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return;
                await navigator.clipboard.writeText(publicUrl);
                toast({ title: "Link copied", description: "Public profile URL copied to clipboard." });
              }}
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card/80 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="w-4 h-4 text-python-yellow" />
              XP Earned
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{entry.xp.toLocaleString()}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Code className="w-4 h-4 text-primary" />
              Problems Solved
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{entry.solved_count}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="w-4 h-4 text-python-yellow" />
              Streak
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{entry.streak} days</div>
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="w-4 h-4 text-streak-green" />
              Wallet
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">${entry.wallet}</div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-border bg-card/80 p-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Medal className="w-5 h-5 text-primary" />
              Snapshot
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {entry.display_name} is building momentum on PyMaster with {entry.xp.toLocaleString()} XP, {entry.solved_count} solved problems, and a {entry.streak}-day coding streak.
            </p>
            <div className="mt-5 h-2 rounded-full bg-surface-2 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((entry.xp % 500) / 500 * 100, 100)}%` }} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Level {level} progress: {entry.xp % 500}/500 XP
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/80 p-6">
            <h2 className="text-lg font-semibold text-foreground">Explore PyMaster</h2>
            <div className="mt-4 space-y-3">
              <Link to="/problems" className="block rounded-xl border border-border bg-surface-1 p-4 text-sm text-foreground hover:border-primary/30">
                Practice coding problems
              </Link>
              <Link to="/learn" className="block rounded-xl border border-border bg-surface-1 p-4 text-sm text-foreground hover:border-primary/30">
                Start the lesson path
              </Link>
              <Link to="/leaderboard" className="block rounded-xl border border-border bg-surface-1 p-4 text-sm text-foreground hover:border-primary/30">
                View the leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
