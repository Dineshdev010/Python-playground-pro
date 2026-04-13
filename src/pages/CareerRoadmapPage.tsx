// ============================================================
// CAREER ROADMAP PAGE — src/pages/CareerRoadmapPage.tsx
// A dedicated page for the comprehensive Python Career Roadmap.
// Moves the CareerRoadmap section from LandingPage to its own page.
// ============================================================
import { Helmet } from "react-helmet-async";
import { CareerRoadmap } from "@/components/CareerRoadmap";
import { PageSkeleton } from "@/components/Skeletons";
import { Suspense } from "react";

export default function CareerRoadmapPage() {
  const canonical = "https://pymaster.pro/career-roadmap";

  return (
    <div className="min-h-screen pt-4 pb-12">
      <Helmet>
        <title>Python Career Roadmap | Path to Mastery | PyMaster</title>
        <meta 
          name="description" 
          content="Explore Python career paths in Web Development, Data Science, AI/ML, Cybersecurity, and more. Find your roadmap to professional success." 
        />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="container mx-auto px-4">
        <Suspense fallback={<PageSkeleton />}>
          <CareerRoadmap />
        </Suspense>
      </div>
    </div>
  );
}
