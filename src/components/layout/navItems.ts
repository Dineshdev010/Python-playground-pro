// ============================================================
// NAV ITEMS - src/components/layout/navItems.ts
// Defines all navigation items used in the sidebar,
// top navbar, and mobile bottom nav.
// ============================================================

import {
  Home,
  FileText,
  FolderKanban,
  BookOpen,
  Code,
  Brain,
  Terminal,
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
  { to: "/", icon: Home, label: "Home", labelKey: "nav.home", emoji: "🏠" },
  { to: "/learn", icon: BookOpen, label: "Learn Python", labelKey: "nav.learnPython", emoji: "📖" },
  { to: "/problems", icon: Code, label: "Problems", labelKey: "nav.problems", emoji: "🔥" },
  { to: "/dsa", icon: Brain, label: "DSA Mastery", labelKey: "nav.dsaMastery", emoji: "🧠" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", labelKey: "nav.dashboard", emoji: "📊" },
  { to: "/blog", icon: FileText, label: "Blog", labelKey: "nav.blog", emoji: "📝" },
  { to: "/projects", icon: FolderKanban, label: "Projects", labelKey: "nav.projects", emoji: "🗂️" },
  { to: "/compiler", icon: Terminal, label: "Compiler", labelKey: "nav.compiler", emoji: "💻" },
  { to: "/aptitude", icon: Calculator, label: "Aptitude", labelKey: "nav.aptitude", emoji: "🧮" },
  { to: "/quick-prep", icon: Zap, label: "Quick Prep", labelKey: "nav.quickPrep", emoji: "⚡" },
  { to: "/python-game", icon: Gamepad2, label: "Python Game", labelKey: "nav.pythonGame", emoji: "🎮" },
  { to: "/python-quiz-100", icon: CircleHelp, label: "Python Quiz", labelKey: "nav.pythonQuiz", emoji: "❓" },
  { to: "/jobs", icon: Briefcase, label: "Jobs", labelKey: "nav.jobs", emoji: "💼" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard", labelKey: "nav.leaderboard", emoji: "🏆" },
  { to: "/career-roadmap", icon: Briefcase, label: "Career Roadmap", labelKey: "nav.careerRoadmap", emoji: "🛣️" },
  { to: "/linux-learn", icon: Terminal, label: "Linux Mastery", labelKey: "nav.linuxMastery", emoji: "🐧" },
  { to: "/certificate", icon: Award, label: "Certificate", labelKey: "nav.certificate", emoji: "📜" },
  { to: "/donate", icon: Heart, label: "Donate", labelKey: "nav.donate", emoji: "❤️" },
  { to: "/about", icon: Info, label: "About Us", labelKey: "nav.aboutUs", emoji: "ℹ️" },
  { to: "/contact", icon: Mail, label: "Contact", labelKey: "nav.contact", emoji: "✉️" },
];

export const mobileNavItems = navItems.filter((item) =>
  ["/", "/learn", "/problems", "/jobs", "/dashboard"].includes(item.to),
);
