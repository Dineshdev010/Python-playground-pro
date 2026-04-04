// ============================================================
// APP COMPONENT — src/App.tsx
// The root component that sets up all providers and routes.
// Think of this as the "skeleton" of the entire application.
// ============================================================

// --- UI Components ---
import { Suspense, lazy, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DashboardSkeleton, EditorSkeleton, PageSkeleton, ProblemsListSkeleton } from "@/components/Skeletons";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProgressProvider } from "@/contexts/ProgressContext";

// --- Lazy-loaded Pages ---
// Each page is loaded on-demand when the user visits its route
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const LearnPage = lazy(() => import("./pages/LearnPage"));
const CareerLearnPage = lazy(() => import("./pages/CareerLearnPage"));
const CompilerPage = lazy(() => import("./pages/CompilerPage"));
const ProblemsListPage = lazy(() => import("./pages/ProblemsListPage"));
const ProblemPage = lazy(() => import("./pages/ProblemPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const JobsPage = lazy(() => import("./pages/JobsPage"));
const DSAPage = lazy(() => import("./pages/DSAPage"));
const AptitudePage = lazy(() => import("./pages/AptitudePage"));
const DonatePage = lazy(() => import("./pages/DonatePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const CompleteProfilePage = lazy(() => import("./pages/CompleteProfilePage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CertificatePage = lazy(() => import("./pages/CertificatePage"));
const CertificateVerificationPage = lazy(() => import("./pages/CertificateVerificationPage"));
const QuickPrepPage = lazy(() => import("./pages/QuickPrepPage"));
const PublicProfilePage = lazy(() => import("./pages/PublicProfilePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5000,
    },
  },
});

type AppRoute = {
  path: string;
  element: ReactNode;
  fallback?: ReactNode;
  protected?: boolean;
};

const appRoutes: AppRoute[] = [
  { path: "/", element: <LandingPage />, fallback: <PageSkeleton /> },
  { path: "/about", element: <AboutPage />, fallback: <PageSkeleton /> },
  { path: "/learn", element: <LearnPage />, fallback: <EditorSkeleton /> },
  { path: "/career/:trackId", element: <CareerLearnPage />, fallback: <EditorSkeleton /> },
  { path: "/compiler", element: <CompilerPage />, fallback: <EditorSkeleton /> },
  { path: "/problems", element: <ProblemsListPage />, fallback: <ProblemsListSkeleton /> },
  { path: "/problems/:id", element: <ProblemPage />, fallback: <EditorSkeleton /> },
  { path: "/dashboard", element: <DashboardPage />, fallback: <DashboardSkeleton />, protected: true },
  { path: "/leaderboard", element: <LeaderboardPage />, fallback: <PageSkeleton /> },
  { path: "/jobs", element: <JobsPage />, fallback: <PageSkeleton /> },
  { path: "/dsa", element: <DSAPage />, fallback: <PageSkeleton /> },
  { path: "/aptitude", element: <AptitudePage />, fallback: <PageSkeleton /> },
  { path: "/donate", element: <DonatePage />, fallback: <PageSkeleton /> },
  { path: "/auth", element: <AuthPage />, fallback: <PageSkeleton /> },
  { path: "/reset-password", element: <ResetPasswordPage />, fallback: <PageSkeleton /> },
  { path: "/complete-profile", element: <CompleteProfilePage />, fallback: <PageSkeleton />, protected: true },
  { path: "/certificate", element: <CertificatePage />, fallback: <PageSkeleton />, protected: true },
  { path: "/certificate/verify/:certificateId", element: <CertificateVerificationPage />, fallback: <PageSkeleton /> },
  { path: "/quick-prep", element: <QuickPrepPage />, fallback: <PageSkeleton /> },
  { path: "/u/:userId", element: <PublicProfilePage />, fallback: <PageSkeleton /> },
  { path: "/privacy", element: <PrivacyPolicyPage />, fallback: <PageSkeleton /> },
  { path: "/contact", element: <ContactPage />, fallback: <PageSkeleton /> },
  { path: "*", element: <NotFound />, fallback: <PageSkeleton /> },
];

function renderRouteElement(route: AppRoute) {
  const content = <Suspense fallback={route.fallback ?? <PageSkeleton />}>{route.element}</Suspense>;
  return route.protected ? <ProtectedRoute>{content}</ProtectedRoute> : content;
}

// ============================================================
// THE APP TREE (Provider Hierarchy):
// QueryClientProvider → ThemeProvider → TooltipProvider → BrowserRouter
//   → ProgressProvider → AuthProvider → AppLayout → Routes
//
// Each provider wraps its children and shares global state.
// ============================================================
const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <ProgressProvider>
                <Toaster />
                <Sonner />
                <AppLayout>
                  <ErrorBoundary>
                    <Routes>
                      {appRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={renderRouteElement(route)} />
                      ))}
                    </Routes>
                  </ErrorBoundary>
                </AppLayout>
              </ProgressProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
