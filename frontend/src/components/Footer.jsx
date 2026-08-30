export default function Footer() {
  return (
    <footer className="border-t border-edge bg-surface/50 mt-20 transition-colors">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-edge/60">
          
          <div className="space-y-1.5 max-w-sm">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold tracking-wider text-ink text-base">
                BIDTUBER
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-brand/10 text-brand border border-brand/20">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                Live Board
              </span>
            </div>
            <p className="text-xs text-mute leading-relaxed">
              The competitive placement leaderboard built for YouTube creators to scale visibility.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-xs text-mute font-medium">
            <a href="#board" className="hover:text-ink transition-colors">Leaderboard</a>
            <a href="#claim" className="hover:text-ink transition-colors">Claim Spot</a>
            <a href="#" className="hover:text-ink transition-colors">Rules & Bidding</a>
            <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-mute font-mono">
          <p>© {new Date().getFullYear()} BidTuber. All rights reserved.</p>
          <p className="text-mute/70">
            Secured payments powered by Razorpay
          </p>
        </div>
      </div>
    </footer>
  );
}