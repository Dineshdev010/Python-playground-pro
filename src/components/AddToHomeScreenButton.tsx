import { useEffect, useState } from "react";
import { Download, Share2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type AddToHomeScreenButtonProps = {
  variant?: "default" | "footer";
};

function isIosDevice() {
  if (typeof window === "undefined") {
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function AddToHomeScreenButton({ variant = "default" }: AddToHomeScreenButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setInstalled(isStandaloneMode());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      setShowIosHint(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    setReady(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const canShowInstall = ready && !installed && (Boolean(deferredPrompt) || isIosDevice());
  const footerVariant = variant === "footer";

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
      }
      return;
    }

    if (isIosDevice()) {
      setShowIosHint((current) => !current);
    }
  };

  return (
    <div className="min-h-[4.75rem] flex flex-col items-center justify-start gap-3">
      {canShowInstall && (
        <Button
          type="button"
          variant={footerVariant ? "default" : "outline"}
          size="lg"
          className={cn(
            "gap-2 text-base h-12 px-8",
            footerVariant
              ? "w-full rounded-xl border-0 bg-gradient-to-r from-primary via-blue-500 to-cyan-500 text-white shadow-[0_10px_30px_rgba(37,99,235,0.35)] hover:brightness-110"
              : "border-primary/20 bg-card/70 backdrop-blur-sm hover:bg-card",
          )}
          onClick={handleInstall}
        >
          <Download className={cn("w-4 h-4", footerVariant ? "animate-pulse" : "")} />
          {footerVariant ? "Download PyMaster App" : "Add to Home Screen"}
        </Button>
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
    </div>
  );
}
