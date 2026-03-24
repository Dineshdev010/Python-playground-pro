// ============================================================
// DASHBOARD PAGE — src/pages/DashboardPage.tsx
// User dashboard with profile editing, stats overview, emoji
// shop, star trophy progress, activity heatmap, and badges.
// ============================================================
import { useState, useRef, useEffect } from "react";
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
import { BookOpen, Code, Flame, Wallet, Trophy, Target, Zap, Star, Award, Camera, Pencil, Check, ShoppingBag, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const trophyMilestones = [
{ stars: 20, emoji: "🥉", title: "Bronze Trophy", color: "bg-reward-gold/10 border-reward-gold/30" },
{ stars: 50, emoji: "🥈", title: "Silver Trophy", color: "bg-muted/10 border-muted/30" },
{ stars: 100, emoji: "🏆", title: "Gold Trophy", color: "bg-python-yellow/10 border-python-yellow/30" },
{ stars: 200, emoji: "💎", title: "Diamond Trophy", color: "bg-primary/10 border-primary/30" },
{ stars: 350, emoji: "🌟", title: "Supernova", color: "bg-expert-purple/10 border-expert-purple/30" },
{ stars: 500, emoji: "👑", title: "Legendary Crown", color: "bg-streak-green/10 border-streak-green/30" },
{ stars: 1000, emoji: "🐉", title: "Dragon Master", color: "bg-destructive/10 border-destructive/30" }];


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
{ emoji: "⭐", title: "Catch Stars", desc: "Grab shooting stars on the home page", link: "/" },
{ emoji: "🔥", title: "Keep Your Streak", desc: "Code every day for bonus rewards", link: "/compiler" }];


export default function DashboardPage() {
  const { progress, attemptStreakRecovery, canRecover, recoveryCost, addWallet } = useProgress();
  const { profile, saveProfile } = useAuth();
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profile) return;
    if (profile.displayName) {
      setProfileName(profile.displayName);
      setNameInput(profile.displayName);
    }
    if (profile.avatarUrl) {
      setProfilePic(profile.avatarUrl);
    }
  }, [profile]);

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative group">
          <Avatar className="w-16 h-16 border-2 border-primary">
            {profilePic ? <AvatarImage src={profilePic} alt="Profile" /> : null}
            <AvatarFallback className="text-2xl bg-primary/20">{selectedEmoji || trophy.emoji}</AvatarFallback>
          </Avatar>
          {selectedEmoji &&
          <span className="absolute -bottom-1 -right-1 text-lg bg-card border border-border rounded-full w-7 h-7 flex items-center justify-center shadow-sm">
              {selectedEmoji}
            </span>
          }
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            
            <Camera className="w-5 h-5 text-foreground" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePicUpload} className="hidden" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {editingName ?
            <div className="flex items-center gap-2">
                <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="bg-surface-1 border border-border rounded-md px-2 py-1 text-lg font-bold text-foreground w-48"
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
          <div className="flex items-center gap-2 mt-1 flex-wrap">
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

      {/* Streak Recovery Banner */}
      {canRecover &&
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

      {/* Stats grid */}
      <SectionErrorBoundary section="Stats">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {stats.map((s) =>
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-lg">{s.emoji}</span>
                
              </div>
              <div className="text-xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              {s.total && typeof s.value === "number" &&
            <div className="mt-2 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(s.value / s.total * 100, 100)}%` }} />
                </div>
            }
            </div>
          )}
        </div>
      </SectionErrorBoundary>

      {/* How to Climb */}
      <SectionErrorBoundary section="How to Climb">
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            🧗 How to Climb
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

      {/* Emoji Shop */}
      <SectionErrorBoundary section="Emoji Shop">
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            🛒 Emoji Shop
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Buy emojis to customize your profile! Balance: <span className="text-reward-gold font-bold">${progress.wallet}</span>
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-3">
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
                className={`w-full rounded-xl p-5 border-2 transition-all duration-300 relative overflow-hidden text-left ${
                equipped ?
                "border-python-yellow bg-python-yellow/15 ring-4 ring-python-yellow/40 shadow-lg shadow-python-yellow/20" :
                owned ?
                "border-streak-green bg-streak-green/10 ring-2 ring-streak-green/30" :
                "border-python-yellow/60 bg-gradient-to-r from-python-yellow/5 via-reward-gold/5 to-python-yellow/5 hover:from-python-yellow/10 hover:to-reward-gold/10 animate-pulse"}`
                }>
                
                <div className="flex items-center gap-5">
                  <div className="text-6xl drop-shadow-lg">{item.emoji}</div>
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

      {/* Star Trophy Progress */}
      <SectionErrorBoundary section="Star Trophies">
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            ⭐ Star Trophies
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Catch shooting stars on the home page to earn trophies! You've caught <span className="text-python-yellow font-bold">{progress.starsCaught}</span> stars.
            {trophy.next > 0 && <> Next trophy at <span className="text-foreground font-bold">{trophy.next}</span> stars.</>}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {trophyMilestones.map((m) => {
              const achieved = progress.starsCaught >= m.stars;
              return (
                <div key={m.stars} className={`rounded-lg p-4 text-center border transition-all duration-300 ${achieved ? m.color + " scale-105" : "bg-surface-1 border-border opacity-40"}`}>
                  <div className="text-3xl mb-1">{m.emoji}</div>
                  <div className="text-sm font-medium text-foreground">{m.title}</div>
                  <div className="text-xs text-muted-foreground">{m.stars} stars</div>
                  {achieved && <div className="text-[10px] text-streak-green mt-1">✅ Achieved</div>}
                </div>);

            })}
          </div>
        </div>
      </SectionErrorBoundary>

      {/* Activity Graph */}
      <SectionErrorBoundary section="Coding Activity">
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            📊 Coding Activity
          </h2>
          <ActivityGraph activityMap={progress.activityMap} />
          <p className="text-xs text-muted-foreground mt-3">
            📅 {Object.keys(progress.activityMap).length} active days in the past year
          </p>
        </div>
      </SectionErrorBoundary>

      {/* Streak Milestones */}
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

      {/* Completion Badges */}
      <SectionErrorBoundary section="Badges">
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <BadgeDisplay />
        </div>
      </SectionErrorBoundary>

      {/* Solved Problems */}
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
    </div>);

}
