import { useState, useEffect } from "react";
import { getQuote } from "../lib/api.js";

const rupees = (paise) => (paise / 100).toLocaleString("en-IN");

export default function HeroClaim({
  totalVerifiedPaise,
  totalVisitors = 150,
  onOpenClaim,
  refreshKey,
}) {
  const [selectedRank, setSelectedRank] = useState(1);
  const [currentPricePaise, setCurrentPricePaise] = useState(4000100);
  const [handleInput, setHandleInput] = useState("");
  const [isChangingRank, setIsChangingRank] = useState(false);

  // Fetch fresh minimum price whenever rank or refreshKey changes
  useEffect(() => {
    let isSubscribed = true;
    setIsChangingRank(true);

    getQuote(selectedRank)
      .then((q) => {
        if (!isSubscribed) return;
        setCurrentPricePaise(q.amountPaise);
      })
      .catch((err) => console.error("Error fetching quote:", err))
      .finally(() => {
        if (isSubscribed) {
          // Subtle timeout for smooth fade-in/out transition effect
          setTimeout(() => setIsChangingRank(false), 150);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [selectedRank, refreshKey]);

  const handleRankUp = () => {
    if (selectedRank > 1) {
      setSelectedRank((r) => r - 1);
    }
  };

  const handleRankDown = () => {
    setSelectedRank((r) => r + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onOpenClaim(selectedRank, handleInput.trim());
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Visitors & Pill Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-edge shadow-sm text-xs font-mono text-mute">
            <span className="font-bold text-ink">{totalVisitors.toLocaleString()}</span> Total Visitors
          </div>

          <span className="text-edge font-mono text-xs hidden sm:inline">•</span>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-[11px] font-mono font-semibold text-brand tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            YOUTUBE CHANNEL PLACEMENT BOARD
          </div>
        </div>

        {/* Dynamic Animated Claim Rank Section */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-ink font-display flex flex-wrap items-center justify-center gap-3">
          <span>Claim</span>

          {/* Interactive Rank Selector Badge */}
          <div className="inline-flex items-center bg-canvas border border-edge rounded-2xl p-1.5 shadow-inner">
            <button
              type="button"
              onClick={handleRankDown}
              className="w-8 h-8 rounded-xl bg-surface hover:bg-edge/40 text-mute hover:text-ink flex items-center justify-center text-xs font-bold transition-all active:scale-90"
              title="Lower Rank"
            >
              ▼
            </button>

            {/* Rank Number with Smooth Transition Animation */}
            <span
              className={`font-mono font-extrabold text-brand px-3 min-w-[3.5rem] transition-all duration-200 ease-out transform ${
                isChangingRank
                  ? "scale-90 opacity-40 blur-[1px]"
                  : "scale-100 opacity-100 blur-0"
              }`}
            >
              #{selectedRank}
            </span>

            <button
              type="button"
              onClick={handleRankUp}
              disabled={selectedRank <= 1}
              className="w-8 h-8 rounded-xl bg-surface hover:bg-edge/40 text-mute hover:text-ink flex items-center justify-center text-xs font-bold transition-all active:scale-90 disabled:opacity-30 disabled:hover:bg-surface"
              title="Higher Rank"
            >
              ▲
            </button>
          </div>

          <span>for</span>

          {/* Price with Smooth Fade Transition */}
          <span
            className={`font-mono text-price transition-all duration-200 ease-out ${
              isChangingRank
                ? "opacity-40 scale-95"
                : "opacity-100 scale-100"
            }`}
          >
            ₹{rupees(currentPricePaise)}
          </span>
        </h1>

        {/* Subtext Quote Banner */}
        <p className="mt-4 text-xs sm:text-sm text-mute max-w-xl transition-opacity duration-200">
          Minimum required bid for <strong className="text-ink">#{selectedRank}</strong> is{" "}
          <strong className="text-price font-mono">₹{rupees(currentPricePaise)}</strong>. You can enter a higher custom amount inside the checkout modal to hold your spot longer.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-8 w-full max-w-lg">
          <div className="p-1.5 bg-surface border border-edge rounded-2xl shadow-xl flex items-center gap-2 transition-within:border-brand">
            <input
              type="text"
              placeholder="Enter YouTube URL or @handle"
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-ink outline-none placeholder:text-mute/60 font-medium"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand/90 active:scale-95 transition-all shadow-md shadow-brand/20 shrink-0"
            >
              Continue to payment →
            </button>
          </div>
        </form>

        {/* Total Verified Placement Pill */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-edge text-xs font-mono text-mute shadow-sm">
          <span className="font-bold text-ink">₹{rupees(totalVerifiedPaise)}</span> verified in total placements
        </div>

      </div>
    </section>
  );
}