/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface Window {
  __hideLoader?: () => void;
  loadPyodide?: (options: { indexURL: string }) => Promise<PyodideInstance>;
  requestIdleCallback?: (callback: IdleRequestCallback) => number;
  webkitAudioContext?: typeof AudioContext;
}

interface PyodideError extends Error {
  type?: string;
}

interface PyodideInstance {
  runPython: (code: string) => unknown;
}
