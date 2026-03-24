// ============================================================
// LANDING PAGE — src/pages/LandingPage.tsx
// The main homepage users see at "/". Assembles all landing
// sections in order: hero, getting started, features, roadmap,
// problems preview, testimonials, career roadmap, and CTA.
// Also includes the animated space background and shooting stars.
// ============================================================

import { Helmet } from "react-helmet-async";
import { Suspense } from "react";
import { VantaBackground } from "@/components/VantaBackground";
import { ShootingStars } from "@/components/ShootingStars";
import { DailyWantedLevel } from "@/components/DailyWantedLevel";
import { HeroSection } from "@/components/landing/HeroSection";
import { GettingStartedSection } from "@/components/landing/GettingStartedSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { RoadmapSection } from "@/components/landing/RoadmapSection";
import { BasicProblemsSection } from "@/components/landing/BasicProblemsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CareerRoadmap } from "@/components/CareerRoadmap";
import { FutureLearningSection } from "@/components/landing/FutureLearningSection";
import { CTASection } from "@/components/landing/CTASection";
import { WinnerBanner } from "@/components/landing/WinnerBanner";
import { LiveActivityFeed } from "@/components/landing/LiveActivityFeed";

// Simple loading fallback for sections
const SectionLoading = () => <div className="h-96 bg-surface-1 animate-pulse rounded-lg" />;

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden relative w-full">
      <Helmet>
        <title>PyMaster | Learn Python Free & Earn Certificates</title>
        <meta name="description" content="Master Python programming from basics to advanced Data Structures and Algorithms with PyMaster's interactive coding challenges, free certificates, and job board." />
        <meta name="keywords" content="Python, Learn Python, Python Course, Coding Interview, Data Structures, Algorithms" />
      </Helmet>
      {/* Restored Native VantaJS Clouds - Guaranteed smooth functionality */}
      <VantaBackground />
      {/* Clickable shooting stars that quiz users with Python riddles for XP */}
      <ShootingStars />
      <DailyWantedLevel />
      <div className="fixed left-3 top-[6.1rem] z-[998] hidden sm:block sm:left-4">
        <LiveActivityFeed />
      </div>
      {/* Main hero with headline, CTA buttons, and quick stats */}
      <HeroSection />
      {/* Visual divider between sections */}
      <div className="section-divider py-2" />
      {/* 4-step getting started guide for new users */}
      <GettingStartedSection />
      {/* 6 feature cards (lessons, editor, problems, rewards, streaks, difficulty) */}
      <FeaturesSection />
      {/* 5-step learning path from basics to advanced */}
      <RoadmapSection />
      {/* Preview of the 50 basic problems with code example */}
      <BasicProblemsSection />
      {/* $10K winner challenge banner */}
      <WinnerBanner />
      {/* User testimonials grid */}
      <TestimonialsSection />
      {/* Career paths section (Data, Web, AI, etc.) with expandable details */}
      <CareerRoadmap />
      {/* Coming soon: Java, JavaScript, React, AI/ML courses */}
      <FutureLearningSection />
      {/* Final call-to-action with "Start Now" and "Browse Jobs" buttons */}
      <CTASection />
    </div>
  );
}
