// ============================================================
// MOBILE NAVIGATION — src/components/layout/MobileNav.tsx
// Bottom navigation bar visible only on mobile (< lg breakpoint).
// Shows emoji icons for quick navigation between main pages.
// ============================================================

import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { mobileNavItems } from "./navItems";

export function MobileNav() {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    // Fixed bottom bar, visible only on mobile (hidden on lg screens)
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="grid h-16 grid-cols-5 items-center px-1">
      {mobileNavItems.map((item) =>
        <Link
          key={item.to}
          to={item.to}
          className={`flex w-full flex-col items-center gap-0.5 rounded-md px-1 py-1 text-[11px] font-medium transition-all duration-200 ${
            // Highlight the active page with primary color and slight scale
            location.pathname === item.to 
              ? "bg-primary/10 text-primary scale-[1.03]" 
              : "text-muted-foreground active:scale-90 hover:text-foreground"
          }`}
        >
          {/* Show emoji instead of Lucide icon on mobile for compactness */}
          <span className="text-[1.22rem] leading-none">{item.emoji}</span>
          {/* Show only the first word of the label (e.g., "Learn" not "Learn Python") */}
          {t(item.labelKey).split(" ")[0]}
        </Link>
      )}
      </div>
    </nav>
  );
}
