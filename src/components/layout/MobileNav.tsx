// ============================================================
// MOBILE NAVIGATION — src/components/layout/MobileNav.tsx
// Bottom navigation bar visible only on mobile (< lg breakpoint).
// Shows emoji icons for quick navigation between main pages.
// ============================================================

import { Link, useLocation } from "react-router-dom";
import { navItems } from "./navItems";

export function MobileNav() {
  const location = useLocation();

  return (
    // Fixed bottom bar, visible only on mobile (hidden on lg screens)
    // Horizontal scrollable to fit all navigation items
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-card border-t border-border overflow-x-auto z-40 px-1 gap-1 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent flex items-center">
      {navItems.map((item) =>
        <Link
          key={item.to}
          to={item.to}
          className={`flex flex-col items-center gap-0.5 text-[10px] min-w-[3.2rem] px-1.5 py-1 rounded-md shrink-0 transition-all duration-200 ${
            // Highlight the active page with primary color and slight scale
            location.pathname === item.to 
              ? "text-primary bg-primary/10 scale-110" 
              : "text-muted-foreground active:scale-90 hover:text-foreground"
          }`}
        >
          {/* Show emoji instead of Lucide icon on mobile for compactness */}
          <span className="text-base">{item.emoji}</span>
          {/* Show only the first word of the label (e.g., "Learn" not "Learn Python") */}
          {item.label.split(" ")[0]}
        </Link>
      )}
    </nav>
  );
}
