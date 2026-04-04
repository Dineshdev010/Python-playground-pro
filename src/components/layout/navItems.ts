// ============================================================
// NAV ITEMS - src/components/layout/navItems.ts
// Defines all navigation items used in the sidebar,
// top navbar, and mobile bottom nav.
// ============================================================

import {
  Home,
  BookOpen,
  Brain,
  Terminal,
  Code,
  Briefcase,
  Trophy,
  LayoutDashboard,
  Heart,
  Info,
  Award,
  Zap,
  Mail,
  Calculator,
  Gamepad2,
  CircleHelp,
} from "lucide-react";

// Each item has: route path, Lucide icon, label text, and emoji (for mobile nav)
export const navItems = [
  { to: "/", icon: Home, label: "Home", emoji: "🏠" },
  { to: "/learn", icon: BookOpen, label: "Learn Python", emoji: "📖" },
  { to: "/dsa", icon: Brain, label: "DSA Mastery", emoji: "🧠" },
  { to: "/compiler", icon: Terminal, label: "Compiler", emoji: "💻" },
  { to: "/problems", icon: Code, label: "Problems", emoji: "🔥" },
  { to: "/aptitude", icon: Calculator, label: "Aptitude", emoji: "🧮" },
  { to: "/quick-prep", icon: Zap, label: "Quick Prep", emoji: "⚡" },
  { to: "/python-game", icon: Gamepad2, label: "Python Game", emoji: "🎮" },
  { to: "/python-quiz-100", icon: CircleHelp, label: "Python Quiz", emoji: "❓" },
  { to: "/jobs", icon: Briefcase, label: "Job Portal", emoji: "💼" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard", emoji: "🏆" },
  { to: "/certificate", icon: Award, label: "Certificate", emoji: "📜" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", emoji: "📊" },
  { to: "/donate", icon: Heart, label: "Donate", emoji: "❤️" },
  { to: "/about", icon: Info, label: "About Us", emoji: "ℹ️" },
  { to: "/contact", icon: Mail, label: "Contact", emoji: "✉️" },
];

export const mobileNavItems = navItems.filter((item) =>
  ["/", "/learn", "/problems", "/jobs", "/dashboard"].includes(item.to),
);
