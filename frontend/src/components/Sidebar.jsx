export default function Sidebar({ categories, selected, onChange }) {
  const all = ["all", ...categories];

  return (
    <aside id="categories" className="w-full sm:w-52 shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-mono font-semibold uppercase tracking-widest text-mute">
          Categories
        </p>
        <span className="text-[10px] font-mono text-mute bg-canvas px-2 py-0.5 rounded-full border border-edge hidden sm:inline-block">
          {categories.length} Tiers
        </span>
      </div>

      <nav className="flex sm:flex-col gap-1.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-none snap-x">
        {all.map((c) => {
          const isSelected = selected === c;
          const label = c === "all" ? "All Channels" : c;

          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              className={`group relative text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 snap-start flex items-center justify-between shrink-0 ${
                isSelected
                  ? "bg-brand/10 text-brand border border-brand/20 shadow-sm"
                  : "text-mute hover:bg-canvas hover:text-ink border border-transparent"
              }`}
            >
              <span className="flex items-center gap-2">
                {c === "all" && <span className="text-xs">🔥</span>}
                <span className="capitalize">{label}</span>
              </span>

              {isSelected && (
                <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-brand shadow-sm shadow-brand" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}