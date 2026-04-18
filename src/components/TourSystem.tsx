import React, { useEffect, useState, useCallback } from "react";
import { Joyride, type EventData, type Step } from "react-joyride";
import { TOUR_STEPS } from "@/data/newTourSteps";
import { useTheme } from "@/components/ThemeProvider";

const LS_TOUR_KEY = "pymaster_tours_seen";

interface TourState {
  run: boolean;
  steps: Step[];
  tourKey: string;
}

export const TourSystem: React.FC = () => {
  const { theme } = useTheme();
  const [state, setState] = useState<TourState>({
    run: false,
    steps: [],
    tourKey: "",
  });

  const getSeenTours = useCallback((): string[] => {
    try {
      return JSON.parse(localStorage.getItem(LS_TOUR_KEY) || "[]");
    } catch {
      return [];
    }
  }, []);

  const markTourAsSeen = useCallback((key: string) => {
    const seen = getSeenTours();
    if (!seen.includes(key)) {
      localStorage.setItem(LS_TOUR_KEY, JSON.stringify([...seen, key]));
    }
  }, [getSeenTours]);

  const startTour = useCallback((key: string, force = false) => {
    const steps = TOUR_STEPS[key];
    if (!steps) return;

    if (!force) {
      const seen = getSeenTours();
      if (seen.includes(key)) return;
    }

    setState({
      run: true,
      steps,
      tourKey: key,
    });
  }, [getSeenTours]);

  useEffect(() => {
    const handleStartTour = (event: any) => {
      const { tourKey, force } = event.detail;
      startTour(tourKey, force);
    };

    window.addEventListener("pymaster-start-tour", handleStartTour);
    return () => window.removeEventListener("pymaster-start-tour", handleStartTour);
  }, [startTour]);

  const handleJoyrideCallback = (data: EventData) => {
    const { status, action } = data;
    const finishedStatuses: string[] = ["finished", "skipped"];

    if (finishedStatuses.includes(status) || action === "close") {
      if (state.tourKey) {
        markTourAsSeen(state.tourKey);
      }
      setState({ run: false, steps: [], tourKey: "" });
    }
  };

  const isDark = theme === "dark";

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideBackButton
      run={state.run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={state.steps}
      options={{
        zIndex: 10000,
        primaryColor: "hsl(var(--primary))",
        backgroundColor: isDark ? "hsl(var(--card))" : "#fff",
        textColor: isDark ? "hsl(var(--foreground))" : "#1a1a1a",
        arrowColor: isDark ? "hsl(var(--card))" : "#fff",
        overlayColor: "rgba(0, 0, 0, 0.75)",
      }}
      styles={{
        tooltip: {
          borderRadius: "1rem",
          padding: "1.25rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
          border: isDark ? "1px solid hsla(var(--primary), 0.2)" : "1px solid #e2e8f0",
        },
        tooltipTitle: {
          fontSize: "1.1rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "hsl(var(--primary))",
          marginBottom: "0.5rem",
        },
        tooltipContent: {
          fontSize: "0.95rem",
          lineHeight: 1.6,
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "#4a5568",
        },
        buttonPrimary: {
          borderRadius: "0.75rem",
          padding: "0.6rem 1.25rem",
          fontSize: "0.85rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          transition: "all 0.2s ease",
        },
        buttonSkip: {
          fontSize: "0.85rem",
          fontWeight: 600,
          color: "hsl(var(--muted-foreground))",
        },
      }}
      locale={{
        last: "Finish",
        skip: "Skip Tour",
        next: "Next",
      }}
    />
  );
};

// Global helper to trigger tour from anywhere
export const triggerTour = (tourKey: string, force = false) => {
  const event = new CustomEvent("pymaster-start-tour", { detail: { tourKey, force } });
  window.dispatchEvent(event);
};
