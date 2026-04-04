// ============================================================
// MAIN ENTRY POINT — src/main.tsx
// This is the very first file that runs when the app loads.
// It mounts the React app onto the HTML page.
// ============================================================

import { createRoot } from "react-dom/client"; // React 18's method to create a root
import App from "./App.tsx"; // The main App component
import "./index.css"; // Global styles (Tailwind CSS + custom styles)

const CHUNK_RELOAD_KEY = "pymaster_chunk_reload_once";

function hideLoaderSafely() {
  if (typeof window !== "undefined" && window.__hideLoader) {
    window.__hideLoader();
  }
}

function showBootError(message: string) {
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#0b1020;color:#e5e7eb;font-family:Inter,system-ui,sans-serif;">
      <div style="max-width:560px;text-align:center;border:1px solid rgba(148,163,184,0.35);border-radius:16px;padding:24px;background:rgba(15,23,42,0.72);">
        <h1 style="margin:0 0 8px 0;font-size:22px;">PyMaster Could Not Start</h1>
        <p style="margin:0 0 16px 0;line-height:1.5;color:#cbd5e1;">${message}</p>
        <button onclick="window.location.reload()" style="border:none;border-radius:10px;padding:10px 14px;background:#2563eb;color:white;font-weight:700;cursor:pointer;">Reload</button>
      </div>
    </div>
  `;
}

function isDynamicImportError(reason: unknown) {
  const text = reason instanceof Error ? reason.message : String(reason ?? "");
  return (
    text.includes("Failed to fetch dynamically imported module") ||
    text.includes("Importing a module script failed") ||
    text.includes("Loading chunk") ||
    text.includes("ChunkLoadError")
  );
}

window.addEventListener("unhandledrejection", (event) => {
  if (!isDynamicImportError(event.reason)) return;

  const alreadyReloaded = sessionStorage.getItem(CHUNK_RELOAD_KEY) === "1";
  if (!alreadyReloaded) {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
    window.location.reload();
    return;
  }

  hideLoaderSafely();
  showBootError("A deployment update was detected. Please hard refresh once (Ctrl+Shift+R).");
});

window.addEventListener("error", () => {
  hideLoaderSafely();
});

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
try {
  createRoot(document.getElementById("root")!).render(<App />);
  sessionStorage.removeItem(CHUNK_RELOAD_KEY);
} catch (error) {
  console.error("App bootstrap failed:", error);
  hideLoaderSafely();
  showBootError("A startup error occurred. Please reload. If it continues, clear site data.");
}

// Hide the loading spinner that shows while React is loading
// The loader is defined in index.html and shown before React mounts
requestAnimationFrame(() => {
  hideLoaderSafely();
});
