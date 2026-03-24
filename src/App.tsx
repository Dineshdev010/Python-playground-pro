// ============================================================
// APP COMPONENT — src/App.tsx
// The root component that sets up all providers and routes.
// Think of this as the "skeleton" of the entire application.
// ============================================================

// --- UI Components ---
import { Toaster } from "@/components/ui/toaster"; // Toast notification system (shadcn)
import { Toaster as Sonner } from "@/components/ui/sonner"; // Alternative toast system (sonner)
import { TooltipProvider } from "@/components/ui/tooltip"; // Enables tooltips across the app

// --- Data Fetching ---
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // React Query for server state

// --- Routing ---
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Client-side routing

// --- Context Providers (global state) ---
import { ProgressProvider } from "@/contexts/ProgressContext"; // Tracks user progress (XP, streak, wallet)
import { AuthProvider } from "@/contexts/AuthContext"; // Handles authentication (login/signup)
import { ThemeProvider } from "@/components/ThemeProvider"; // Dark/light theme toggle
import { HelmetProvider } from "react-helmet-async";

// --- Error Handling ---
import { ErrorBoundary } from "@/components/ErrorBoundary"; // Catches runtime errors gracefully

// --- Layout ---
import { AppLayout } from "@/components/AppLayout"; // Main layout with navbar, sidebar, footer

// --- Performance: Lazy Loading ---
// lazy() loads pages only when user navigates to them (code splitting)
// This makes the initial page load much faster
import { lazy, Suspense } from "react";
import { PageSkeleton, EditorSkeleton, DashboardSkeleton, ProblemsListSkeleton } from "@/components/Skeletons";
import { ProtectedRoute } from "@/components/ProtectedRoute"; // Redirects to /auth if not logged in

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
const DonatePage = lazy(() => import("./pages/DonatePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const CompleteProfilePage = lazy(() => import("./pages/CompleteProfilePage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const CertificatePage = lazy(() => import("./pages/CertificatePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// --- React Query Configuration ---
// retry: 1 = retry failed requests once
// staleTime: 5000 = data is "fresh" for 5 seconds before refetching
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 5000 } } });

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
              {/* Toast notifications (two systems for different styles) */}
              <Toaster />
              <Sonner />

              {/* AppLayout adds navbar, sidebar, and footer */}
              <AppLayout>
                {/* ErrorBoundary catches any crash inside routes */}
                <ErrorBoundary>
                  <Routes>
                    {/* Each route maps a URL path to a page component */}
                    {/* Suspense shows a skeleton loader while the page loads */}
                    <Route path="/" element={<Suspense fallback={<PageSkeleton />}><LandingPage /></Suspense>} />
                    <Route path="/about" element={<Suspense fallback={<PageSkeleton />}><AboutPage /></Suspense>} />
                    <Route path="/learn" element={<Suspense fallback={<EditorSkeleton />}><LearnPage /></Suspense>} />
                    <Route path="/career/:trackId" element={<Suspense fallback={<EditorSkeleton />}><CareerLearnPage /></Suspense>} />
                    <Route path="/compiler" element={<Suspense fallback={<EditorSkeleton />}><CompilerPage /></Suspense>} />
                    <Route path="/problems" element={<Suspense fallback={<ProblemsListSkeleton />}><ProblemsListPage /></Suspense>} />
                    <Route path="/problems/:id" element={<Suspense fallback={<EditorSkeleton />}><ProblemPage /></Suspense>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardPage /></Suspense></ProtectedRoute>} />
                    <Route path="/leaderboard" element={<Suspense fallback={<PageSkeleton />}><LeaderboardPage /></Suspense>} />
                    <Route path="/jobs" element={<Suspense fallback={<PageSkeleton />}><JobsPage /></Suspense>} />
                    <Route path="/dsa" element={<Suspense fallback={<PageSkeleton />}><DSAPage /></Suspense>} />
                    <Route path="/donate" element={<Suspense fallback={<PageSkeleton />}><DonatePage /></Suspense>} />
                    <Route path="/auth" element={<Suspense fallback={<PageSkeleton />}><AuthPage /></Suspense>} />
                    <Route path="/reset-password" element={<Suspense fallback={<PageSkeleton />}><ResetPasswordPage /></Suspense>} />
                    <Route path="/complete-profile" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><CompleteProfilePage /></Suspense></ProtectedRoute>} />
                    <Route path="/certificate" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><CertificatePage /></Suspense></ProtectedRoute>} />
                    <Route path="/privacy" element={<Suspense fallback={<PageSkeleton />}><PrivacyPolicyPage /></Suspense>} />
                    {/* Catch-all: any unknown URL shows 404 */}
                    <Route path="*" element={<Suspense fallback={<PageSkeleton />}><NotFound /></Suspense>} />
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
