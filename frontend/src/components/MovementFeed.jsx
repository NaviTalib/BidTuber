const rupees = (paise) => (paise / 100).toLocaleString("en-IN");

export default function MovementFeed({ movements }) {
  if (!movements?.length) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
          </span>
          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-mute">
            Live Board Activity
          </p>
        </div>
        <span className="text-[10px] font-mono font-medium text-mute bg-canvas px-2 py-0.5 rounded-full border border-edge">
          {movements.length} recent
        </span>
      </div>

      <div className="border border-edge rounded-2xl bg-surface/50 backdrop-blur-sm divide-y divide-edge/60 max-h-72 overflow-y-auto shadow-sm">
        {movements.map((m) => {
          const isNewEntry = m.event_type !== "update";

          return (
            <div
              key={m.id}
              className="flex items-center justify-between px-4 py-3 text-sm hover:bg-canvas/50 transition-colors gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold ${
                    isNewEntry
                      ? "bg-online/10 text-online border border-online/20"
                      : "bg-brand/10 text-brand border border-brand/20"
                  }`}
                >
                  {isNewEntry ? "NEW" : "UP"}
                </span>

                <span className="text-ink font-medium truncate text-xs sm:text-sm">
                  {m.channel_name}{" "}
                  <span className="text-mute font-normal">
                    {isNewEntry ? "claimed spot" : "moved to"}
                  </span>{" "}
                  <span className="font-mono font-bold text-ink">
                    #{m.rank}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-price font-bold text-xs sm:text-sm bg-priceSoft/50 px-2 py-0.5 rounded-md border border-price/10">
                  ₹{rupees(m.price_paise)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}