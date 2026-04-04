import { useState, useEffect } from "react";
import { ChevronDown, Clock, HeartHandshake, LogIn, LogOut, Menu, Moon, Settings, Sun, Trophy, User, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AdViewModal } from "@/components/AdViewModal";
import { StreakFire } from "@/components/StreakFire";
import { useTheme } from "@/components/ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/contexts/ProgressContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { navItems } from "./navItems";

function getUserLevelLabel(xp: number) {
  if (xp >= 3000) return "Advanced";
  if (xp >= 1000) return "Intermediate";
  return "Beginner";
}

function TimeTracker() {
  const { progress, addTimeSpent } = useProgress();
  const [localTick, setLocalTick] = useState(0);

  // Tick local UI every second for a butter-smooth clock
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTick(p => p + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync to global context every 60 seconds (saves to localStorage automatically)
  useEffect(() => {
    const interval = setInterval(() => {
      addTimeSpent(60); 
    }, 60000);
    return () => clearInterval(interval);
  }, [addTimeSpent]);

  // Merge the persistently saved context time with the current minute's ticks
  const totalSeconds = (progress?.timeSpent || 0) + (localTick % 60);
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const displayTime = hours > 0 
    ? `${hours}h ${minutes}m` 
    : `${minutes}m ${secs}s`;

  return (
    <div className="hidden xl:flex items-center">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono px-2 py-1 rounded-md bg-secondary/50 border border-border/50 shadow-[0_0_10px_rgba(59,130,246,0.1)]" title="Total Code Time">
        <Clock className="w-3.5 h-3.5 text-primary animate-pulse" />
        <span className="text-foreground tracking-wider font-semibold">{displayTime}</span>
      </div>
    </div>
  );
}

interface TopNavbarProps {
  onMenuToggle: () => void;
}

export function TopNavbar({ onMenuToggle }: TopNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const levelNumber = Math.floor(progress.xp / 500) + 1;
  const levelLabel = getUserLevelLabel(progress.xp);
  const primaryNavRoutes = ["/", "/learn", "/dsa", "/compiler", "/quick-prep", "/certificate"];
  const primaryNavItems = navItems.filter((item) => primaryNavRoutes.includes(item.to));
  const secondaryNavItems = navItems.filter((item) => !primaryNavRoutes.includes(item.to));

  const handleSignOut = async () => {
    try {
      await logout();
      toast({ title: "Signed out", description: "You've been signed out successfully." });
      navigate("/");
    } catch {
      toast({ title: "Error", description: "Failed to sign out.", variant: "destructive" });
    }
  };

  const [showAd, setShowAd] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.dataset.navProfileOpen = profileMenuOpen ? "true" : "false";
    window.dispatchEvent(new CustomEvent("pymaster-sidebar-change", { detail: { profileOpen: profileMenuOpen } }));

    return () => {
      delete document.body.dataset.navProfileOpen;
    };
  }, [profileMenuOpen]);

  return (
    <>
    <AdViewModal
      isOpen={showAd}
      onClose={() => setShowAd(false)}
      completionTitle="Thanks for supporting PyMaster"
      completionDescription="You can keep learning while we grow the platform."
    />
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-[999] flex items-center px-2 sm:px-4 justify-between shrink-0">
      <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-3">
        <button
          onClick={onMenuToggle}
          className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 group relative overflow-hidden">
          <motion.img 
            src="/logo.png" 
            alt="PyMaster" 
            className="w-12 h-12 rounded-xl relative z-10 shadow-lg saturate-150" 
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            decoding="async"
            fetchPriority="high"
          />
          <span className="font-bold text-lg text-foreground hidden sm:flex relative z-10 overflow-hidden">
            {"PyMaster".split("").map((char, index) => (
              <motion.span
                key={index}
                animate={{
                  y: [0, -10, 0, 15, 0], // Jump, snap back, fall down (break), regain
                  rotate: [0, 0, 0, 25, 0], // Twist when breaking
                  opacity: [1, 1, 1, 0.4, 1], // Fade slightly when broken
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 3, // Sit still for 3 seconds before next loop
                  delay: index * 0.08, // Stagger each letter
                  times: [0, 0.2, 0.4, 0.6, 1], // Keyframe timing
                  ease: "easeInOut"
                }}
                style={{ display: "inline-block" }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </Link>
        <nav className="ml-1 hidden min-w-0 flex-1 items-center gap-1 lg:flex xl:ml-2">
          <div className="flex min-w-0 items-center gap-0.5">
          {primaryNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-[11px] transition-all duration-200 xl:gap-1.5 xl:px-2.5 xl:text-xs ${
                location.pathname === item.to
                  ? "bg-secondary text-foreground font-medium scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 hover:scale-105 active:scale-95"
              }`}
            >
              <span className="text-sm">{item.emoji}</span>
              {item.to === "/quick-prep" ? "Quick" : item.to === "/certificate" ? "Cert" : item.label.split(" ")[0]}
            </Link>
          ))}
          </div>
          {secondaryNavItems.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-[11px] transition-all duration-200 xl:gap-1.5 xl:px-2.5 xl:text-xs ${
                    secondaryNavItems.some((item) => location.pathname === item.to)
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                  aria-label="Open more navigation links"
                >
                  <span className="text-sm">⋯</span>
                  More
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="mt-2 w-52">
                {secondaryNavItems.map((item) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to} className="flex w-full cursor-pointer items-center gap-2">
                      <span className="text-sm">{item.emoji}</span>
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
      <div className="ml-2 flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Smooth Real-Time Study Clock */}
        <TimeTracker />
        <button
          onClick={() => setShowAd(true)}
          className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors shrink-0"
          title="Support PyMaster"
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Support</span>
        </button>
        {!user && (
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}
        <div className="hidden md:flex">
          <StreakFire streak={progress.streak} size="sm" showQuote />
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-sm">
          <Wallet className="w-4 h-4 text-reward-gold" />
          <span className="text-foreground font-medium">${progress.wallet}</span>
        </div>
        <div className="hidden xl:flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-secondary">
          <Trophy className="w-3 h-3 text-python-yellow" />
          <span className="text-muted-foreground">{levelLabel} • Lv {levelNumber}</span>
        </div>
        {user ? (
          <DropdownMenu open={profileMenuOpen} onOpenChange={setProfileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary transition-colors outline-none cursor-pointer shrink-0">
                <Avatar className="h-7 w-7 shrink-0 border border-primary/25 ring-2 ring-primary/10 shadow-sm">
                  {localStorage.getItem("pymaster_avatar") ? (
                    <AvatarImage
                      src={localStorage.getItem("pymaster_avatar") || ""}
                      alt="Profile"
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-python-yellow/20 text-xs font-bold text-primary">
                    {(localStorage.getItem("pymaster_name") || user.displayName || user.email || "U")[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden xl:block text-xs text-foreground font-medium truncate max-w-[80px]">
                  {localStorage.getItem("pymaster_name") || user.displayName || user.email?.split("@")[0] || "User"}
                </span>
                <Settings className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                <ChevronDown className="w-4 h-4 text-primary animate-bounce origin-top" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel className="flex flex-col">
                <span className="truncate font-semibold">{localStorage.getItem("pymaster_name") || user.displayName || "User"}</span>
                <span className="text-xs text-muted-foreground truncate font-normal">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="cursor-pointer flex items-center w-full">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile & Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            to="/auth"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
    </>
  );
}
