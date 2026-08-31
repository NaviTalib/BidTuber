import ThemeToggle from "./ThemeToggle.jsx";

export default function Header({ period, onPeriodChange, onClaimClick }) {
  return (
    <header className="border-b border-edge bg-surface/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Period Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-6 min-w-0">
          <a href="/" className="font-display text-lg sm:text-xl font-bold tracking-tight text-ink shrink-0 hover:opacity-90 transition-opacity">
            Bid<span className="text-brand">Tuber</span>
          </a>

          {/* Period Toggle Pill */}
          <div className="inline-flex rounded-full border border-edge bg-canvas p-0.5 sm:p-1 shadow-inner shrink-0">
            <button
              type="button"
              onClick={() => onPeriodChange("alltime")}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-sm font-medium transition-all duration-200 ${
                period === "alltime"
                  ? "bg-surface shadow-sm text-ink border border-edge/50"
                  : "text-mute hover:text-ink"
              }`}
            >
              All-time
            </button>
            <button
              type="button"
              onClick={() => onPeriodChange("today")}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-sm font-medium transition-all duration-200 ${
                period === "today"
                  ? "bg-surface shadow-sm text-ink border border-edge/50"
                  : "text-mute hover:text-ink"
              }`}
            >
              Today
            </button>
          </div>
        </div>

        {/* Navigation, Theme Toggle & Action CTA */}
        <div className="flex items-center gap-2 sm:gap-5 shrink-0">
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-mute">
            <a href="#board" className="hover:text-ink transition-colors">Board</a>
            <a href="#categories" className="hover:text-ink transition-colors">Categories</a>
          </nav>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => onClaimClick(1)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand text-white text-xs sm:text-sm font-semibold hover:bg-brand/90 active:scale-95 transition-all shadow-md shadow-brand/20 shrink-0"
          >
            <span className="hidden xs:inline">Claim rank</span>
            <span className="xs:hidden">Claim</span>
          </button>
        </div>
      </div>
    </header>
  );
}