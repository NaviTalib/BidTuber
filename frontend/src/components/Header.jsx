import ThemeToggle from "./ThemeToggle.jsx";

export default function Header({ period, onPeriodChange, onlineNow }) {
  return (
    <header className="border-b border-edge bg-surface/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Period Switcher */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="/" className="font-display text-xl font-bold tracking-tight text-ink shrink-0 hover:opacity-90 transition-opacity">
            Bid<span className="text-brand">Tuber</span>
          </a>

          <div className="inline-flex rounded-full border border-edge bg-canvas p-1 shadow-inner">
            <button
              type="button"
              onClick={() => onPeriodChange("alltime")}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
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
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                period === "today"
                  ? "bg-surface shadow-sm text-ink border border-edge/50"
                  : "text-mute hover:text-ink"
              }`}
            >
              Today
            </button>
          </div>
        </div>

        {/* Status Badge, Links, Theme Toggle & CTA */}
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="hidden sm:inline-flex items-center gap-2 text-xs font-mono font-medium text-mute bg-canvas border border-edge/60 px-2.5 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-online opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-online" />
            </span>
            {onlineNow.toLocaleString()} watching
          </span>

          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-mute">
            <a href="#board" className="hover:text-ink transition-colors">Board</a>
            <a href="#categories" className="hover:text-ink transition-colors">Categories</a>
          </nav>

          <ThemeToggle />

          <a
            href="#claim"
            className="px-4 py-2 rounded-full bg-brand text-white text-xs sm:text-sm font-semibold hover:bg-brand/90 active:scale-95 transition-all shadow-md shadow-brand/20 shrink-0"
          >
            Claim rank
          </a>
        </div>
      </div>
    </header>
  );
}