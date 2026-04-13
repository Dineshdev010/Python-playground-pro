/// <reference lib="webworker" />

const PYODIDE_VERSION = "0.26.4";
const OUTPUT_LIMIT = 12000;
const PYODIDE_BASE_URLS = [
  `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
  `https://pyodide-cdn2.iodide.io/v${PYODIDE_VERSION}/full/`,
  "/pyodide/",
];

type PyodideRuntime = {
  setStdout: (options: { batched?: (message: string) => void }) => void;
  setStderr: (options: { batched?: (message: string) => void }) => void;
  runPythonAsync: (code: string) => Promise<void>;
  loadPackage: (names: string | string[]) => Promise<void>;
};

type LoadPyodide = (options: { indexURL: string }) => Promise<PyodideRuntime>;

let pyodidePromise: Promise<PyodideRuntime> | null = null;

function appendLimited(text: string, chunk: string) {
  if (!chunk) {
    return text;
  }

  const combined = text + chunk;
  if (combined.length <= OUTPUT_LIMIT) {
    return combined;
  }

  return combined.slice(0, OUTPUT_LIMIT) + "\n... output truncated ...";
}

async function loadRuntime() {
  if (pyodidePromise) {
    return pyodidePromise;
  }

  pyodidePromise = (async () => {
    const globalScope = self as typeof self & {
      loadPyodide?: LoadPyodide;
      importScripts: (...urls: string[]) => void;
    };

    let lastError: unknown = null;

    for (const baseUrl of PYODIDE_BASE_URLS) {
      try {
        if (!globalScope.loadPyodide) {
          globalScope.importScripts(`${baseUrl}pyodide.js`);
        }

        if (!globalScope.loadPyodide) {
          throw new Error("Pyodide loader did not initialize.");
        }

        return await globalScope.loadPyodide({
          indexURL: baseUrl,
        }) as unknown as PyodideRuntime;
      } catch (error) {
        lastError = error;
      }
    }

    pyodidePromise = null;
    throw new Error(
      lastError instanceof Error
        ? `Could not load Python runtime from the available CDNs. ${lastError.message}`
        : "Could not load Python runtime from the available CDNs.",
    );
  })();

  return pyodidePromise;
}

async function executeCode(requestId: number, code: string) {
  try {
    const pyodide = await loadRuntime();
    let stdout = "";
    let stderr = "";

    // Load sqlite3 if needed (Pyodide 0.26.0+ unvendored it)
    if (code.includes("import sqlite3")) {
      await pyodide.loadPackage("sqlite3");
    }

    // Load pandas if the user imports it
    if (code.includes("import pandas") || code.includes("from pandas")) {
      await pyodide.loadPackage("pandas");
    }

    // Load numpy if the user imports it
    if (code.includes("import numpy") || code.includes("from numpy")) {
      await pyodide.loadPackage("numpy");
    }

    // Suppress verbose warnings that confuse learners (e.g. Pandas Pyarrow DeprecationWarning)
    try {
      await pyodide.runPythonAsync(`
import warnings as __warnings
__warnings.filterwarnings("ignore", category=DeprecationWarning)
__warnings.filterwarnings("ignore", category=FutureWarning)
__warnings.filterwarnings("ignore", category=UserWarning)
del __warnings
      `);
    } catch {
      // ignore setup errors
    }

    pyodide.setStdout({
      batched: (message: string) => {
        stdout = appendLimited(stdout, `${message}\n`);
      },
    });
    pyodide.setStderr({
      batched: (message: string) => {
        stderr = appendLimited(stderr, `${message}\n`);
      },
    });

    try {
      await pyodide.runPythonAsync(code);
    } catch (error) {
      const pyodideError = error as Error & { type?: string };
      const message = pyodideError.type
        ? `${pyodideError.type}: ${pyodideError.message}`
        : pyodideError.message || String(error);

      if (!stderr) {
        stderr = message;
      } else {
        stderr = appendLimited(stderr, `\n${message}`);
      }
    }

    pyodide.setStdout({});
    pyodide.setStderr({});

    self.postMessage({
      type: "execution-result",
      requestId,
      result: {
        output: stdout.trimEnd(),
        error: stderr.trimEnd(),
        exitCode: stderr ? 1 : 0,
      },
    });
  } catch (error) {
    self.postMessage({
      type: "worker-error",
      requestId,
      error: error instanceof Error ? error.message : "Unknown worker error",
    });
  }
}

self.addEventListener("message", async (event: MessageEvent) => {
  const { type, requestId, code } = event.data ?? {};

  if (type === "init") {
    try {
      await loadRuntime();
      self.postMessage({ type: "worker-ready" });
    } catch (error) {
      self.postMessage({
        type: "worker-error",
        error: error instanceof Error ? error.message : "Failed to initialize Python worker",
      });
    }
    return;
  }

  if (type === "execute" && typeof requestId === "number" && typeof code === "string") {
    await executeCode(requestId, code);
  }
});
