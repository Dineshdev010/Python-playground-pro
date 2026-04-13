// ============================================================
// MAIN ENTRY POINT — src/main.tsx
// This is the very first file that runs when the app loads.
// It mounts the React app onto the HTML page.
// ============================================================

import { createRoot } from "react-dom/client"; // React 18's method to create a root
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx"; // The main App component
import "./index.css"; // Global styles (Tailwind CSS + custom styles)
import { initSentry } from "./lib/sentry";

// Initialize error tracking
initSentry();

const CHUNK_RELOAD_KEY = "pymaster_chunk_reload_once";
let appMounted = false;

function hideLoaderSafely() {
  if (typeof window !== "undefined" && window.__hideLoader) {
    window.__hideLoader();
  }
}

function showBootError(message: string) {
  const root = document.getElementById("root");
  if (!root) return;

  // Clear existing content safely
  root.textContent = "";

  const container = document.createElement("div");
  container.style.cssText = "min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#0b1020;color:#e5e7eb;font-family:Inter,system-ui,sans-serif;";

  const box = document.createElement("div");
  box.style.cssText = "max-width:560px;text-align:center;border:1px solid rgba(148,163,184,0.35);border-radius:16px;padding:24px;background:rgba(15,23,42,0.72);";

  const h1 = document.createElement("h1");
  h1.style.cssText = "margin:0 0 8px 0;font-size:22px;";
  h1.textContent = "PyMaster Could Not Start";

  const p = document.createElement("p");
  p.style.cssText = "margin:0 0 16px 0;line-height:1.5;color:#cbd5e1;";
  p.textContent = message;

  const btn = document.createElement("button");
  btn.style.cssText = "border:none;border-radius:10px;padding:10px 14px;background:#2563eb;color:white;font-weight:700;cursor:pointer;";
  btn.textContent = "Reload";
  btn.onclick = () => window.location.reload();

  box.appendChild(h1);
  box.appendChild(p);
  box.appendChild(btn);
  container.appendChild(box);
  root.appendChild(container);
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
  if (isDynamicImportError(event.reason)) {
    const alreadyReloaded = sessionStorage.getItem(CHUNK_RELOAD_KEY) === "1";
    if (!alreadyReloaded) {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
      window.location.reload();
      return;
    }

    hideLoaderSafely();
    showBootError("A deployment update was detected. Please hard refresh once (Ctrl+Shift+R).");
    return;
  }

  if (appMounted) {
    // Non-fatal async errors can happen after app mount; don't replace the UI.
    console.error("Unhandled promise rejection:", event.reason);
    return;
  }

  hideLoaderSafely();
  showBootError("A startup promise failed. Open DevTools Console and share the first red error line.");
});

window.addEventListener("error", (event) => {
  if (appMounted) {
    console.error("Runtime error:", event.error || event.message);
    return;
  }

  hideLoaderSafely();
  const msg = event.message || "A startup script failed.";
  showBootError(`${msg} Open DevTools Console and share the first red error line.`);
});

// Mount the App component into the <div id="root"> in index.html
try {
  registerSW({
    immediate: true,
    onRegisterError(error) {
      console.warn("Service worker registration warning:", error);
    },
  });
  createRoot(document.getElementById("root")!).render(<App />);
  appMounted = true;
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
