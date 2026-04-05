import { useEffect, useState } from "react";
import { CheckCircle2, Download, Share2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type AddToHomeScreenButtonProps = {
  variant?: "default" | "footer" | "compact";
  className?: string;
};

const INSTALL_FLAG_KEY = "pymaster_app_installed";

function isIosDevice() {
  if (typeof window === "undefined") {
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

function isAndroidDevice() {
  if (typeof window === "undefined") {
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
}

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function AddToHomeScreenButton({ variant = "default", className }: AddToHomeScreenButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);
  const [showAndroidHint, setShowAndroidHint] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const knownInstalled = localStorage.getItem(INSTALL_FLAG_KEY) === "1";
    setInstalled(isStandaloneMode() || knownInstalled);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      localStorage.setItem(INSTALL_FLAG_KEY, "1");
      setDeferredPrompt(null);
      setShowIosHint(false);
      setShowAndroidHint(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    setReady(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const canShowInstall = ready && !installed;
  const footerVariant = variant === "footer";
  const compactVariant = variant === "compact";
  const canShowInlineHints = !compactVariant;

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
        localStorage.setItem(INSTALL_FLAG_KEY, "1");
        setDeferredPrompt(null);
      }
      return;
    }

    if (isIosDevice()) {
      if (!canShowInlineHints) {
        const target = document.getElementById("download-app");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      setShowIosHint((current) => !current);
      setShowAndroidHint(false);
      return;
    }

    if (isAndroidDevice()) {
      if (!canShowInlineHints) {
        const target = document.getElementById("download-app");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      setShowAndroidHint((current) => !current);
      setShowIosHint(false);
    }
  };

  return (
    <div
      className={cn(
        compactVariant ? "flex items-center justify-center" : "min-h-[4.75rem] flex flex-col items-center justify-start gap-3",
        className,
      )}
    >
      {canShowInstall && (
        <Button
          type="button"
          variant={footerVariant || compactVariant ? "default" : "outline"}
          size={compactVariant ? "sm" : "lg"}
          className={cn(
            compactVariant ? "h-9 px-3 gap-1.5 rounded-lg text-xs font-semibold" : "gap-2 text-base h-12 px-8",
            footerVariant
              ? "h-auto min-h-11 w-full rounded-xl border-0 bg-gradient-to-r from-primary via-blue-500 to-cyan-500 px-4 py-3 text-center text-sm leading-tight text-white whitespace-normal shadow-[0_10px_30px_rgba(37,99,235,0.35)] hover:brightness-110"
              : compactVariant
                ? "border-0 bg-gradient-to-r from-primary to-blue-500 text-white shadow-[0_6px_18px_rgba(37,99,235,0.35)] hover:brightness-110"
              : "border-primary/20 bg-card/70 backdrop-blur-sm hover:bg-card",
          )}
          onClick={handleInstall}
        >
          <Download className={cn("w-4 h-4", footerVariant ? "animate-pulse" : "")} />
          {footerVariant ? (
            <>
              <span className="sm:hidden">Download App</span>
              <span className="hidden sm:inline">Download PyMaster App</span>
            </>
          ) : compactVariant ? "Install App" : "Add to Home Screen"}
        </Button>
      )}

      {ready && installed && (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-streak-green/35 bg-streak-green/10 px-3 py-1 text-xs font-semibold text-streak-green",
            compactVariant ? "h-8" : "h-8",
          )}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          App Installed
        </div>
      )}

      {canShowInstall && showIosHint && (
        <div className={cn("max-w-sm rounded-2xl border border-border bg-card/90 px-4 py-3 text-left shadow-lg backdrop-blur-sm", footerVariant ? "max-w-none w-full" : "")}>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Smartphone className="w-4 h-4 text-primary" />
            Install on iPhone
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-6">
            Tap the <Share2 className="inline w-4 h-4 align-text-bottom text-primary" /> Share button in Safari, then choose <span className="font-medium text-foreground">Add to Home Screen</span>.
          </p>
        </div>
      )}

      {canShowInstall && showAndroidHint && (
        <div className={cn("max-w-sm rounded-2xl border border-border bg-card/90 px-4 py-3 text-left shadow-lg backdrop-blur-sm", footerVariant ? "max-w-none w-full" : "")}>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Smartphone className="w-4 h-4 text-primary" />
            Install on Android
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-6">
            In Chrome, tap menu (three dots) and choose <span className="font-medium text-foreground">Install app</span> or <span className="font-medium text-foreground">Add to Home screen</span>.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            If you uninstalled recently, refresh once and try again after a few seconds.
          </p>
        </div>
      )}
    </div>
  );
}
