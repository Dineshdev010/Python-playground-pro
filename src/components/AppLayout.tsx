// ============================================================
// APP LAYOUT — src/components/AppLayout.tsx
// The main layout wrapper that appears on every page.
// Includes: Top Navbar, Sidebar, Mobile Nav, Footer, and more.
// ============================================================

import { useLocation } from "react-router-dom";
import { useProgress } from "@/contexts/ProgressContext";
import { CelebrationModal } from "@/components/CelebrationModal"; // Popup for achievements
import { FeedbackForm } from "@/components/FeedbackForm"; // Floating feedback button
import { Footer } from "@/components/Footer"; // Page footer (only on home/donate pages)
import { OnboardingTour } from "@/components/OnboardingTour"; // First-time user walkthrough
import { TopNavbar } from "@/components/layout/TopNavbar"; // Top navigation bar
import { Sidebar } from "@/components/layout/Sidebar"; // Desktop sidebar (toggle)
import { MobileNav } from "@/components/layout/MobileNav"; // Bottom navigation for mobile
import { ActiveUsersBanner } from "@/components/ActiveUsersBanner";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { CustomCursor } from "@/components/CustomCursor";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { showCelebration, celebrationData, dismissCelebration, logActivity } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Controls sidebar visibility
  const isAuthPage = location.pathname === "/auth"; // Auth page has a simpler layout
  const hideFooter =
    isAuthPage ||
    location.pathname.startsWith("/compiler") ||
    location.pathname.startsWith("/problems/") ||
    location.pathname === "/dashboard" ||
    location.pathname === "/certificate" ||
    location.pathname.startsWith("/learn") ||
    location.pathname.startsWith("/dsa") ||
    location.pathname === "/jobs";
  const hideActiveUsersBadge =
    location.pathname.startsWith("/learn") ||
    location.pathname.startsWith("/dsa") ||
    location.pathname.startsWith("/compiler") ||
    location.pathname.startsWith("/problems/");
  const { toast } = useToast();

  useEffect(() => {
    document.body.dataset.sidebarOpen = sidebarOpen ? "true" : "false";
    window.dispatchEvent(new CustomEvent("pymaster-sidebar-change", { detail: { sidebarOpen } }));

    return () => {
      delete document.body.dataset.sidebarOpen;
    };
  }, [sidebarOpen]);

  // Ensure every route change starts at the top (prevents landing at the footer).
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Disable smooth scrolling just for this jump-to-top.
    const el = document.documentElement;
    const prevBehavior = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";

    // Reset any browser scroll restoration (helps on refresh/back behavior in some browsers).
    try {
      if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    } catch {
      // ignore
    }

    // Window scroll
    window.scrollTo({ top: 0, left: 0 });

    // Also reset the document scrolling element (some browsers use this internally).
    const scrollingEl = document.scrollingElement;
    if (scrollingEl) scrollingEl.scrollTop = 0;

    requestAnimationFrame(() => {
      el.style.scrollBehavior = prevBehavior;
    });
  }, [location.pathname]);

  // Log activity on first visit of the day to update streak counter
  useEffect(() => {
    logActivity();
    
    // Check if we already welcomed them this browser session
    if (!sessionStorage.getItem("pymaster_welcomed")) {
      sessionStorage.setItem("pymaster_welcomed", "true");
      setTimeout(() => {
        toast({
          title: "👋 Welcome back, PyMaster!",
          description: "Don't forget to catch your 3 daily stars!",
          duration: 5000,
        });
      }, 1500);
    }
  }, [logActivity, toast]);

  // --- Simplified layout for the auth (login/signup) page ---
  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
        {/* Celebration modal (can appear on any page) */}
        <CelebrationModal
          isOpen={showCelebration}
          onClose={dismissCelebration}
          title={celebrationData?.title || ""}
          subtitle={celebrationData?.subtitle || ""}
          emoji={celebrationData?.emoji || "🎉"}
          reward={celebrationData?.reward}
        />
        <main className="flex-1 w-full">{children}</main>
      </div>
    );
  }

  // --- Full layout for all other pages ---
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      {/* Achievement celebration popup */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={dismissCelebration}
        title={celebrationData?.title || ""}
        subtitle={celebrationData?.subtitle || ""}
        emoji={celebrationData?.emoji || "🎉"}
        reward={celebrationData?.reward}
      />

      {/* Top navigation bar with logo, nav links, streak, wallet, etc. */}
      <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Live activity banner below the fixed navbar */}
      {!hideActiveUsersBadge && !sidebarOpen && <ActiveUsersBanner />}

      {/* Sidebar: slides in from left when menu button is clicked */}
      <AnimatePresence>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </AnimatePresence>

      {/* Mobile bottom navigation bar (visible on small screens only) */}
      <MobileNav />

      {/* Main content area — pb-16 adds padding for mobile nav, pt-14 for fixed navbar */}
      <main className="flex-1 pt-14 pb-16 lg:pb-0 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer: keep trust/navigation links visible across public pages */}
      {!hideFooter && <Footer />}

      {/* Floating feedback button (bottom-right corner) */}
      <FeedbackForm />
      
      {/* First-time user onboarding tour */}
      <OnboardingTour />
      
      {/* Global custom cursor effect */}
      <CustomCursor />
    </div>
  );
}
