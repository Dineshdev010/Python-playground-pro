// ============================================================
// LANDING PAGE — src/pages/LandingPage.tsx
// The main homepage users see at "/". Assembles all landing
// sections in order: hero, getting started, features, roadmap,
// problems preview, testimonials, career roadmap, and CTA.
// Also includes the animated space background and shooting stars.
// ============================================================

import { Helmet } from "react-helmet-async";
import { lazy, Suspense, useEffect, useState } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { SkyBackground } from "@/components/landing/SkyBackground";

// Defer non-critical sections to improve first load performance.
const ShootingStars = lazy(() => import("@/components/ShootingStars").then((m) => ({ default: m.ShootingStars })));
const DailyWantedLevel = lazy(() => import("@/components/DailyWantedLevel").then((m) => ({ default: m.DailyWantedLevel })));
const GettingStartedSection = lazy(() => import("@/components/landing/GettingStartedSection").then((m) => ({ default: m.GettingStartedSection })));
const FeaturesSection = lazy(() => import("@/components/landing/FeaturesSection").then((m) => ({ default: m.FeaturesSection })));
const RoadmapSection = lazy(() => import("@/components/landing/RoadmapSection").then((m) => ({ default: m.RoadmapSection })));
const BasicProblemsSection = lazy(() => import("@/components/landing/BasicProblemsSection").then((m) => ({ default: m.BasicProblemsSection })));
const TestimonialsSection = lazy(() => import("@/components/landing/TestimonialsSection").then((m) => ({ default: m.TestimonialsSection })));
const CareerRoadmap = lazy(() => import("@/components/CareerRoadmap").then((m) => ({ default: m.CareerRoadmap })));
const FutureLearningSection = lazy(() => import("@/components/landing/FutureLearningSection").then((m) => ({ default: m.FutureLearningSection })));
const CTASection = lazy(() => import("@/components/landing/CTASection").then((m) => ({ default: m.CTASection })));
const WinnerBanner = lazy(() => import("@/components/landing/WinnerBanner").then((m) => ({ default: m.WinnerBanner })));
const LiveActivityFeed = lazy(() => import("@/components/landing/LiveActivityFeed").then((m) => ({ default: m.LiveActivityFeed })));
const GoogleAd = lazy(() => import("@/components/ads/GoogleAd").then((m) => ({ default: m.GoogleAd })));

export default function LandingPage() {
  const [hideFloatingBadges, setHideFloatingBadges] = useState(false);
  const [deferFx, setDeferFx] = useState(false);
  const [clockIsNight, setClockIsNight] = useState(() => {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18;
  });

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    if (idle) {
      idle(() => setDeferFx(true), { timeout: 1200 });
      return;
    }

    const t = window.setTimeout(() => setDeferFx(true), 700);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const updatePhase = () => {
      const hour = new Date().getHours();
      setClockIsNight(hour < 6 || hour >= 18);
    };

    updatePhase();
    const interval = window.setInterval(updatePhase, 2 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const syncSidebarState = (event?: Event) => {
      const detail =
        event && "detail" in event
          ? ((event as CustomEvent<{ sidebarOpen?: boolean; profileOpen?: boolean }>).detail ?? {})
          : {};
      const sidebarOpen =
        typeof detail.sidebarOpen === "boolean" ? detail.sidebarOpen : document.body.dataset.sidebarOpen === "true";
      const profileOpen =
        typeof detail.profileOpen === "boolean" ? detail.profileOpen : document.body.dataset.navProfileOpen === "true";
      const nextOpen = sidebarOpen || profileOpen;
      setHideFloatingBadges(nextOpen);
    };

    syncSidebarState();
    window.addEventListener("pymaster-sidebar-change", syncSidebarState as EventListener);

    return () => {
      window.removeEventListener("pymaster-sidebar-change", syncSidebarState as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden relative w-full">
      <Helmet>
        <title>PyMaster | Learn Python with Lessons, Challenges, Jobs, and Certificates</title>
        <meta name="description" content="Learn Python with structured lessons, coding challenges, interview prep, a browser compiler, certificate pathways, and a practical Python job board." />
        <meta name="keywords" content="Python, Learn Python, Python Course, Coding Interview, Data Structures, Algorithms" />
        <meta property="og:title" content="PyMaster | Learn Python with Real Practice" />
        <meta property="og:description" content="Structured Python learning, coding challenges, quick prep, career tracks, and certificate pathways in one platform." />
        <meta name="twitter:title" content="PyMaster | Learn Python with Real Practice" />
        <meta name="twitter:description" content="Structured Python lessons, interactive challenges, and practical job-focused prep." />
      </Helmet>
      {/* Sky background (auto day/night) */}
      <SkyBackground />
      {/* Clickable shooting stars that quiz users with Python riddles for XP */}
      {deferFx && clockIsNight && (
        <Suspense fallback={null}>
          <ShootingStars />
        </Suspense>
      )}
      {!hideFloatingBadges && deferFx && (
        <Suspense fallback={null}>
          <DailyWantedLevel />
        </Suspense>
      )}
      {!hideFloatingBadges && (
        <div className="fixed left-3 top-[6.1rem] z-[998] hidden sm:block sm:left-4">
          <Suspense fallback={null}>
            <LiveActivityFeed />
          </Suspense>
        </div>
      )}
      {/* Main hero with headline, CTA buttons, and quick stats */}
      <HeroSection />
      {/* Visual divider between sections */}
      <div className="section-divider py-2" />
      {/* 4-step getting started guide for new users */}
      <div className="cv-auto">
        <Suspense fallback={null}>
          <GettingStartedSection />
        </Suspense>
      </div>
      {/* 6 feature cards (lessons, editor, problems, rewards, streaks, difficulty) */}
      <div className="cv-auto">
        <Suspense fallback={null}>
          <FeaturesSection />
        </Suspense>
      </div>
      <section className="container mx-auto px-4 sm:px-6 py-4 cv-auto">
        <Suspense fallback={null}>
          <GoogleAd
            slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}
            label="Sponsored Learning Pick"
            minHeight={170}
          />
        </Suspense>
      </section>
      {/* 5-step learning path from basics to advanced */}
      <div className="cv-auto">
        <Suspense fallback={null}>
          <RoadmapSection />
        </Suspense>
      </div>
      {/* Preview of the 50 basic problems with code example */}
      <div className="cv-auto">
        <Suspense fallback={null}>
          <BasicProblemsSection />
        </Suspense>
      </div>
      {/* $10K winner challenge banner */}
      <div className="cv-auto">
        <Suspense fallback={null}>
          <WinnerBanner />
        </Suspense>
      </div>
      {/* User testimonials grid */}
      <div className="cv-auto">
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>
      </div>
      {/* Career paths section (Data, Web, AI, etc.) with expandable details */}
      <div className="cv-auto">
        <Suspense fallback={null}>
          <CareerRoadmap />
        </Suspense>
      </div>
      {/* Coming soon: Java, JavaScript, React, AI/ML courses */}
      <div className="cv-auto">
        <Suspense fallback={null}>
          <FutureLearningSection />
        </Suspense>
      </div>
      {/* Final call-to-action with "Start Now" and "Browse Jobs" buttons */}
      <div className="cv-auto">
        <Suspense fallback={null}>
          <CTASection />
        </Suspense>
      </div>
    </div>
  );
}
