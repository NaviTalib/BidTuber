import { useState } from "react";
import { registerView } from "../lib/api.js";

const rupees = (paise) => (paise / 100).toLocaleString("en-IN");

export default function ListingRow({ channel, onClaimClick }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [clicks, setClicks] = useState(channel.clicks || 0);

  const showImage = channel.thumbnail_url && !imgFailed;
  const isTop1 = channel.rank === 1;
  const isTop2 = channel.rank === 2;
  const isTop3 = channel.rank === 3;

  const handleClick = () => {
    setClicks((prev) => prev + 1);
    registerView(channel.id);
  };

  const getRankBadgeStyle = () => {
    if (isTop1) return "bg-amber-500 text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-400/30";
    if (isTop2) return "bg-slate-400 text-white shadow-md shadow-slate-400/20 ring-2 ring-slate-300/30";
    if (isTop3) return "bg-amber-700 text-white shadow-md shadow-amber-700/20 ring-2 ring-amber-600/30";
    return "bg-canvas text-mute border border-edge";
  };

  return (
    <div
      className={`group flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        isTop1
          ? "bg-priceSoft/60 border-price/30 shadow-sm"
          : "bg-surface border-edge hover:border-brand/40"
      }`}
    >
      <span
        className={`font-mono font-bold text-sm sm:text-base w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${getRankBadgeStyle()}`}
      >
        #{channel.rank}
      </span>

      <div className="w-11 h-11 rounded-xl bg-canvas border border-edge overflow-hidden shrink-0 shadow-inner">
        {showImage ? (
          <img
            src={channel.thumbnail_url}
            alt={channel.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mute text-xs font-mono font-bold bg-surface">
            {channel.name?.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="font-semibold text-sm sm:text-base text-ink hover:text-brand transition-colors truncate block"
          >
            {channel.name}
          </a>
          
          <span className="shrink-0 inline-flex items-center gap-1 font-mono text-[10px] font-medium bg-canvas border border-edge/80 text-mute px-2 py-0.5 rounded-full">
            <span className="text-[9px]">👆</span> {clicks.toLocaleString()}
          </span>
        </div>

        <p className="text-xs text-mute truncate leading-none">
          {channel.subscribers ? (
            <span className="font-medium text-ink/80">{channel.subscribers} subs</span>
          ) : null}
          {channel.subscribers && channel.category ? " · " : ""}
          {channel.category}
          {channel.description ? ` · ${channel.description}` : ""}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
        <span className="font-mono text-price font-bold text-sm sm:text-base">
          ₹{rupees(channel.price_paise)}
        </span>
        <button
          type="button"
          onClick={() => onClaimClick(channel.rank, channel.handle)}
          className="text-xs font-medium px-3 py-1 rounded-lg border border-edge bg-canvas hover:bg-brand hover:text-white hover:border-brand text-mute active:scale-95 transition-all shadow-sm"
        >
          Outbid
        </button>
      </div>
    </div>
  );
}