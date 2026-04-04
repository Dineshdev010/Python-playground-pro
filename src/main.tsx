// ============================================================
// MAIN ENTRY POINT — src/main.tsx
// This is the very first file that runs when the app loads.
// It mounts the React app onto the HTML page.
// ============================================================

import { createRoot } from "react-dom/client"; // React 18's method to create a root
import App from "./App.tsx"; // The main App component
import "./index.css"; // Global styles (Tailwind CSS + custom styles)

// Only register the service worker in production builds.
// Registering in dev can slow HMR and cause confusing cache behavior.
if (import.meta.env.PROD) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        // Force clients to pick up the newest deployed assets quickly.
        updateSW(true);
      },
    });
  }).catch(err => console.error("SW Registration failed:", err));
}

// Mount the App component into the <div id="root"> in index.html
createRoot(document.getElementById("root")!).render(<App />);

// Hide the loading spinner that shows while React is loading
// The loader is defined in index.html and shown before React mounts
requestAnimationFrame(() => {
  if (window.__hideLoader) {
    window.__hideLoader();
  }
});
