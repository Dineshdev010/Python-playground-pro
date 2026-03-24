import { useEffect, useMemo, useState } from "react";
import { Activity, Dot } from "lucide-react";

const MIN_ACTIVE_USERS = 148;
const MAX_ACTIVE_USERS = 412;
const ROTATION_WINDOW_MS = 5 * 60 * 1000;

function getActiveUsersForWindow(windowKey: number) {
  const normalized = Math.abs(Math.sin(windowKey * 12.9898) * 43758.5453) % 1;
  return Math.round(MIN_ACTIVE_USERS + normalized * (MAX_ACTIVE_USERS - MIN_ACTIVE_USERS));
}

export function ActiveUsersBanner() {
  const initialWindow = useMemo(() => Math.floor(Date.now() / ROTATION_WINDOW_MS), []);
  const [windowKey, setWindowKey] = useState(initialWindow);

  useEffect(() => {
    const syncWindow = () => setWindowKey(Math.floor(Date.now() / ROTATION_WINDOW_MS));
    const interval = setInterval(syncWindow, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeUsers = getActiveUsersForWindow(windowKey);

  return (
    <div className="fixed left-3 top-[4.15rem] z-[998] sm:left-4">
      <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-background/85 px-2.5 py-1 text-[11px] shadow-lg backdrop-blur-md">
        <Activity className="h-3.5 w-3.5 text-emerald-500" />
        <span className="font-semibold text-foreground">{activeUsers.toLocaleString()}</span>
        <Dot className="h-3.5 w-3.5 text-emerald-500" />
        <span className="text-muted-foreground">active</span>
      </div>
    </div>
  );
}
