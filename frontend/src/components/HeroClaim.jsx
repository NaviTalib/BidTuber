import { useEffect, useState } from "react";
import { getQuote } from "../lib/api.js";

const rupees = (paise) => (paise / 100).toLocaleString("en-IN");

export default function HeroClaim({ totalVerifiedPaise, onOpenClaim }) {
  const [rank, setRank] = useState(1);
  const [amountPaise, setAmountPaise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [handle, setHandle] = useState("");

  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);

    getQuote(rank)
      .then((q) => {
        if (isSubscribed) setAmountPaise(q.amountPaise);
      })
      .catch(console.error)
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [rank]);

  const nudge = (delta) => setRank((r) => Math.max(1, r - delta));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onOpenClaim(rank, handle);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-5 pt-16 pb-12 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-edge shadow-sm mb-6">
        <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
        <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-mute">
          YouTube Channel Placement Board
        </span>
      </div>

      <h1 className="font-display font-extrabold text-ink flex flex-wrap items-center justify-center gap-3 text-4xl sm:text-6xl leading-tight tracking-tight">
        <span>Claim</span>

        <div className="inline-flex items-center gap-1.5 bg-canvas border border-edge rounded-2xl p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Lower tier (cheaper rank)"
            className="w-8 h-8 rounded-xl bg-surface border border-edge/80 text-mute hover:text-ink active:scale-95 hover:bg-edge/30 transition-all flex items-center justify-center text-sm font-bold"
          >
            ▼
          </button>
          
          <span className="text-brand font-mono font-extrabold px-2 min-w-[3.5rem]">
            #{rank}
          </span>

          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Higher tier (better rank)"
            className="w-8 h-8 rounded-xl bg-surface border border-edge/80 text-mute hover:text-ink active:scale-95 hover:bg-edge/30 transition-all flex items-center justify-center text-sm font-bold"
          >
            ▲
          </button>
        </div>

        <span>for</span>

        <span className="inline-flex items-center bg-priceSoft border border-price/20 rounded-2xl px-4 py-1.5">
          <span className="font-mono font-bold text-price text-3xl sm:text-4xl whitespace-nowrap">
            {loading || amountPaise === null ? (
              <span className="inline-block animate-pulse">₹···</span>
            ) : (
              `₹${rupees(amountPaise)}`
            )}
          </span>
        </span>
      </h1>

      <p className="mt-6 text-sm sm:text-base text-mute max-w-xl mx-auto leading-relaxed">
        Paid placements start at ₹5. Outbid the channel above you to claim their spot.
        Placements are instantly published once payment is confirmed.
      </p>

      <div id="claim" className="mt-8 max-w-lg mx-auto">
        <div className="p-1.5 bg-surface border border-edge focus-within:border-brand/60 focus-within:ring-4 focus-within:ring-brand/10 rounded-2xl shadow-xl transition-all flex flex-col sm:flex-row gap-2">
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter YouTube URL or @handle"
            className="flex-1 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-mute/60 outline-none"
          />
          <button
            type="button"
            onClick={() => onOpenClaim(rank, handle)}
            className="px-6 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand/90 active:scale-[0.98] transition-all shadow-md shadow-brand/25 whitespace-nowrap"
          >
            Continue to payment →
          </button>
        </div>
      </div>

      <div className="mt-6 inline-flex items-center gap-2 text-xs font-mono text-mute bg-canvas border border-edge/60 px-3.5 py-1.5 rounded-full shadow-sm">
        <span className="font-semibold text-ink">
          ₹{rupees(totalVerifiedPaise || 0)}
        </span>
        <span>verified in total placements</span>
      </div>
    </section>
  );
}