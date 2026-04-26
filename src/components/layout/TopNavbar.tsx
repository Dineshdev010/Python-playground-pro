import { useState, useEffect } from "react";
import { 
  Check, ChevronDown, Clock, HeartHandshake, Languages, LogIn, LogOut, Menu, Moon, Settings, Sun, 
  User, Volume2, VolumeX, Medal, Wallet, Focus, RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AdViewModal } from "@/components/AdViewModal";
import { StreakFire } from "@/components/StreakFire";
import { useTheme } from "@/components/ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProgress } from "@/contexts/ProgressContext";
import { useFocus } from "@/contexts/FocusContext";
import { useSound } from "@/contexts/SoundContext";
import { useToast } from "@/hooks/use-toast";
import { getXpLevel } from "@/lib/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { navItems } from "./navItems";


const MENU_HINT_KEY = "pymaster_menu_hint_dismissed";



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
  const { language, setLanguage, languageOptions, t } = useLanguage();
  const { muted, toggleMuted } = useSound();
  const { setShowFocusSettings, isActive, timeLeft } = useFocus();
  const { toast } = useToast();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const primaryNavRoutes = ["/", "/learn", "/problems", "/dsa", "/dashboard"];
  const primaryNavItems = navItems.filter((item) => primaryNavRoutes.includes(item.to));
  const secondaryNavItems = navItems.filter((item) => !primaryNavRoutes.includes(item.to));
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMenuHint, setShowMenuHint] = useState(false);
  const menuGroups: Array<{ label: string; routes: string[] }> = [
    { label: t("menu.content"), routes: ["/blog", "/projects"] },
    { label: t("menu.practice"), routes: ["/compiler", "/quick-prep", "/python-game", "/python-quiz-100", "/aptitude"] },
    { label: t("menu.career"), routes: ["/jobs", "/career-roadmap", "/linux-learn", "/leaderboard", "/certificate"] },
    { label: t("menu.support"), routes: ["/donate", "/about", "/contact"] },
  ];
  const isRouteActive = (route: string) =>
    location.pathname === route || location.pathname.startsWith(`${route}/`);


  const groupedMenuItems = menuGroups
    .map((group) => ({
      label: group.label,
      items: group.routes
        .map((route) => secondaryNavItems.find((item) => item.to === route))
        .filter(Boolean),
    }))
    .filter((group) => group.items.length > 0);

  const groupedRouteSet = new Set(menuGroups.flatMap((g) => g.routes));
  const ungroupedMenuItems = secondaryNavItems.filter((item) => !groupedRouteSet.has(item.to));

  const handleSignOut = async () => {
    try {
      await logout();
      toast({ title: "Signed out", description: "You've been signed out successfully." });
      navigate("/");
    } catch {
      toast({ title: "Error", description: "Failed to sign out.", variant: "destructive" });
    }
  };

  const handleHardRefresh = async () => {
    try {
      // Unregister all service workers
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }
      // Clear caches
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        for (const name of cacheNames) {
          await caches.delete(name);
        }
      }
      // Force reload
      window.location.reload();
    } catch (error) {
      console.error("Hard refresh failed:", error);
      window.location.reload();
    }
  };

  const [showAd, setShowAd] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(MENU_HINT_KEY) === "1";
      if (!dismissed) setShowMenuHint(true);
    } catch {
      // ignore (privacy modes can block storage)
    }
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    try {
      localStorage.setItem(MENU_HINT_KEY, "1");
    } catch {
      // ignore
    }
    setShowMenuHint(false);
  }, [menuOpen]);

  useEffect(() => {
    document.body.dataset.navProfileOpen = profileMenuOpen ? "true" : "false";
    window.dispatchEvent(new CustomEvent("pymaster-sidebar-change", { detail: { profileOpen: profileMenuOpen } }));

    return () => {
      delete document.body.dataset.navProfileOpen;
    };
  }, [profileMenuOpen]);

  const getLanguageTranslationKey = (val: string): any => {
    if (val === "english") return "language.defaultEnglish";
    return `language.${val}`;
  };
  const selectedLanguageLabel = t(getLanguageTranslationKey(language)) || "Default (English)";

  const xpLevel = getXpLevel(progress.xp);
  const isHighRank = xpLevel.level >= 13;

  return (
    <>
    <style>{`
      @keyframes nav-shimmer {
        0% { transform: translateX(-150%); opacity: 0; }
        50% { opacity: 0.5; }
        100% { transform: translateX(150%); opacity: 0; }
      }
    `}</style>
    <AdViewModal
      isOpen={showAd}
      onClose={() => setShowAd(false)}
      completionTitle="Thanks for supporting PyMaster"
      completionDescription="You can keep learning while we grow the platform."
    />
    <header className="h-16 sm:h-14 border-b border-border bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-[999] flex items-center px-2 sm:px-4 justify-between shrink-0">
      <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-3">
        <button
          onClick={onMenuToggle}
          className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Menu className="w-5 h-5 sm:w-5 sm:h-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 group relative overflow-hidden">
          <motion.img 
            src="/logo.png" 
            alt="PyMaster" 
            className="w-12 h-12 rounded-xl relative z-10 shadow-lg brightness-110 saturate-[1.7] contrast-110" 
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
        <nav id="tour-nav-links" className="ml-1 hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:flex xl:ml-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex shrink-0 items-center gap-0.5">
          {primaryNavItems.map((item) => {
            const navLabel = item.to === "/quick-prep"
              ? t("nav.quickPrep")
              : item.to === "/python-game"
                ? t("nav.pythonGame")
                : t(item.labelKey);
            const routeId = item.to === "/" ? "home" : (item.to.replace(/^\//, "") || "home");
            const hideOnLg = item.to === "/dashboard";
            return (
            <Link
              key={item.to}
              id={`tour-nav-${routeId}`}
              to={item.to}
              className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-[10px] transition-all duration-200 xl:gap-1.5 xl:px-2.5 xl:text-[11px] ${
                hideOnLg ? "hidden xl:flex" : "flex"
              } ${
                isRouteActive(item.to)
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 active:scale-95"
              }`}
              title={navLabel}
            >
              <span className="shrink-0 text-sm">{item.emoji}</span>
              <span className="whitespace-nowrap">{navLabel}</span>
            </Link>
          );
          })}
          </div>
          {secondaryNavItems.length > 0 && (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`relative ml-1 flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[11px] transition-all duration-200 xl:gap-1.5 xl:px-3 xl:text-xs border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    secondaryNavItems.some((item) => isRouteActive(item.to))
                      ? "bg-secondary text-foreground font-semibold border-primary/30 shadow-sm"
                      : "bg-secondary/40 border-border/60 text-foreground/90 hover:bg-secondary hover:border-primary/30 hover:shadow-sm"
                  }`}
                  aria-label="Open more navigation links"
                >
                  {showMenuHint && !menuOpen ? (
                    <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary text-primary-foreground px-3 py-1 text-[10px] font-semibold shadow-md border border-primary/30">
                      {t("common.morePages")}
                      <span className="absolute left-1/2 top-full -translate-x-1/2 h-2 w-2 rotate-45 bg-primary border-r border-b border-primary/30" />
                    </span>
                  ) : null}
                  {t("common.menu")}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="mt-2 w-52">
                {groupedMenuItems.map((group, groupIndex) => (
                  <div key={group.label}>
                    <DropdownMenuLabel className={groupIndex === 0 ? "px-2 py-1.5 text-xs" : "px-2 py-1.5 text-xs mt-1"}>
                      {group.label}
                    </DropdownMenuLabel>
                    {group.items.map((item) => (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link to={item.to} className="flex w-full cursor-pointer items-center gap-2">
                          <span className="text-sm">{item.emoji}</span>
                          <span>{t(item.labelKey)}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    {groupIndex < groupedMenuItems.length - 1 || ungroupedMenuItems.length > 0 ? <DropdownMenuSeparator /> : null}
                  </div>
                ))}
                {ungroupedMenuItems.map((item) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to} className="flex w-full cursor-pointer items-center gap-2">
                      <span className="text-sm">{item.emoji}</span>
                      <span>{t(item.labelKey)}</span>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium bg-secondary/50 text-foreground hover:bg-secondary transition-colors shrink-0 border border-border/60"
              aria-label="Select language"
              title={`Language: ${selectedLanguageLabel}`}
            >
              <Languages className="w-3.5 h-3.5 shrink-0" />
              <ChevronDown className="w-3.5 h-3.5 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 mt-2">
            <DropdownMenuLabel>{t("language.title")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {languageOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className="cursor-pointer flex items-center justify-between"
                onClick={() => setLanguage(option.value)}
              >
                <span>{t(getLanguageTranslationKey(option.value))}</span>
                {language === option.value ? <Check className="w-4 h-4 text-primary" /> : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Link
          to="/contact"
          className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors shrink-0"
          title={t("common.support")}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span className="hidden 2xl:inline">{t("common.support")}</span>
        </Link>
        {!user && (
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 sm:w-4 sm:h-4" /> : <Moon className="w-5 h-5 sm:w-4 sm:h-4" />}
          </button>
        )}
        <button
          onClick={toggleMuted}
          className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label={muted ? "Unmute sounds" : "Mute sounds"}
          title={muted ? "Unmute sounds" : "Mute sounds"}
        >
          {muted ? <VolumeX className="w-5 h-5 sm:w-4 sm:h-4" /> : <Volume2 className="w-5 h-5 sm:w-4 sm:h-4" />}
        </button>
        <div className="hidden md:flex">
          <StreakFire streak={progress.streak} size="sm" showQuote />
        </div>
        <Link
          to="/dashboard"
          className="hidden lg:flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[11px] font-semibold text-amber-200 shadow-[0_0_14px_rgba(251,191,36,0.14)] transition-all duration-300 hover:scale-105 hover:bg-amber-400/15"
          title={`Wallet balance: $${progress.wallet}`}
        >
          <Wallet className="h-3.5 w-3.5 text-amber-300" />
          <span className="font-mono tracking-tight">${progress.wallet}</span>
        </Link>
        <button
          onClick={() => setShowFocusSettings(true)}
          className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer shadow-sm ${
            isActive ? "bg-primary/20 border-primary/40 text-primary animate-pulse" : "bg-secondary/40 border-border/60 text-foreground/90 hover:bg-secondary hover:border-primary/30"
          }`}
          title="Productive Clock"
        >
          <Focus className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
          <span className="font-bold tracking-tight text-[11px] font-mono">
            {isActive ? formatTime(timeLeft) : <span className="hidden 2xl:inline">Focus</span>}
          </span>
        </button>
        <div 
          className={`hidden xl:flex relative items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full border backdrop-blur-md overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 group cursor-default shadow-sm ${xpLevel.color} ${xpLevel.bg} ${xpLevel.border}`}
          title={`${Math.round(xpLevel.progressPercentage)}% to level ${xpLevel.level + 1}`}
        >
          {isHighRank && (
            <div className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <div className="w-[150%] h-full bg-gradient-to-r from-transparent via-white to-transparent -skew-x-[25deg] animate-[nav-shimmer_5s_infinite]" />
            </div>
          )}
          <Medal className={`w-3.5 h-3.5 ${isHighRank ? "animate-pulse" : ""}`} />
          <span className="hidden 2xl:inline font-bold tracking-tight">{xpLevel.title} <span className="opacity-30 mx-0.5">•</span> Lv {xpLevel.level}</span>
          <span className="2xl:hidden font-bold tracking-tight">Lv {xpLevel.level}</span>
          
          {/* Micro Progress Bar */}
          <div className="absolute bottom-0 left-0 h-[1.5px] bg-current opacity-20 w-full" />
          <div 
            className="absolute bottom-0 left-0 h-[1.5px] bg-current shadow-[0_0_4px_currentColor] transition-all duration-1000 ease-out" 
            style={{ width: `${xpLevel.progressPercentage}%` }} 
          />
        </div>

        {user ? (
          <DropdownMenu open={profileMenuOpen} onOpenChange={setProfileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button id="tour-nav-profile" className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary transition-colors outline-none cursor-pointer shrink-0">
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
                <span className="hidden 2xl:block text-xs text-foreground font-medium truncate max-w-[80px]">
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
                  <span>{t("common.profileDashboard")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleHardRefresh} className="cursor-pointer">
                <RefreshCw className="mr-2 h-4 w-4" />
                <span>Refresh & Update</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                <span>{theme === "dark" ? t("common.lightMode") : t("common.darkMode")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("common.signOut")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            to="/auth"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t("common.signIn")}</span>
          </Link>
        )}
      </div>
    </header>
    </>
  );
}
