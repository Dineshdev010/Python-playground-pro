import * as Sentry from "@sentry/react";

/**
 * Sentry Initialization — Error Tracking
 * To enable, add VITE_SENTRY_DSN to your .env.local file.
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn || dsn.includes("your-dsn")) {
    if (import.meta.env.DEV) {
      console.log("[Sentry] Skipping initialization: No DSN found in environment.");
    }
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, 
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/.*\.supabase\.co/],
    // Session Replay
    replaysSessionSampleRate: 0.1, 
    replaysOnErrorSampleRate: 1.0, 
    environment: import.meta.env.MODE,
  });

  if (import.meta.env.DEV) {
    console.log("[Sentry] Initialized in", import.meta.env.MODE, "mode.");
  }
}
