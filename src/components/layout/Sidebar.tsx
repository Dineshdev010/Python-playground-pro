import { Link, useLocation } from "react-router-dom";
import { Check, ChevronDown, ChevronLeft, Languages, Wallet, User } from "lucide-react";
import { motion } from "framer-motion";
import { useProgress } from "@/contexts/ProgressContext";
import { getStreakTitle } from "@/lib/progress";
import { StreakFire } from "@/components/StreakFire";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navItems } from "./navItems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const { progress } = useProgress();
  const { user } = useAuth();
  const { language, setLanguage, languageOptions, t } = useLanguage();
  const profileName = localStorage.getItem("pymaster_name") || user?.displayName || user?.email?.split("@")[0] || "Guest";
  const profilePic = localStorage.getItem("pymaster_avatar") || "";
  const languageLabelByValue = {
    english: t("language.defaultEnglish"),
    tamil: t("language.tamil"),
    kannada: t("language.kannada"),
    telugu: t("language.telugu"),
    hindi: t("language.hindi"),
  } as const;
  const selectedLanguageLabel = languageLabelByValue[language] ?? t("language.defaultEnglish");

  if (!open) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        className="fixed top-0 left-0 h-screen w-60 bg-card border-r border-border z-50 flex flex-col shadow-xl"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={onClose}>
            <img src="/logo.png" alt="PyMaster" className="w-9 h-9 rounded-lg" decoding="async" />
            <span className="font-bold text-foreground">PyMaster</span>
          </Link>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 pt-3 pb-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
            &gt;&gt;&gt; import pymaster
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-primary/15 text-primary font-medium border-l-2 border-primary scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 hover:translate-x-1 active:scale-95"
                }`}
              >
                <span className="text-base">{item.emoji}</span>
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          {/* Account info */}
          {user && (
            <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <Avatar className="h-8 w-8 shrink-0 border border-primary/20 ring-2 ring-primary/10 shadow-sm">
                {profilePic ? <AvatarImage src={profilePic} alt="User Profile Avatar" className="object-cover" /> : null}
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-python-yellow/20 text-primary">
                  <User className="w-3.5 h-3.5" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">{profileName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </Link>
          )}
          <div className="flex items-center gap-2">
            <StreakFire streak={progress.streak} size="sm" />
            <div className="min-w-0">
              <p className="text-xs text-foreground font-medium truncate">{getStreakTitle(progress.streak)}</p>
              <p className="text-[10px] text-muted-foreground">{progress.streak} day streak</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Wallet className="w-4 h-4 text-reward-gold" />
            <span className="text-foreground font-medium">${progress.wallet}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-xs font-medium bg-secondary/50 text-foreground hover:bg-secondary transition-colors border border-border/60"
                aria-label="Select language"
                title={`${t("language.title")}: ${selectedLanguageLabel}`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5" />
                  <span>{selectedLanguageLabel}</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>{t("language.title")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languageOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className="cursor-pointer flex items-center justify-between"
                  onClick={() => setLanguage(option.value)}
                >
                  <span>{languageLabelByValue[option.value]}</span>
                  {language === option.value ? <Check className="w-4 h-4 text-primary" /> : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="text-[9px] text-muted-foreground font-mono mt-1"># Python {">>"} Life 🐍</p>
        </div>
      </motion.aside>
    </>
  );
}
