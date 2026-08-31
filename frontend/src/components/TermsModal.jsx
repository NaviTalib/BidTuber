export default function TermsModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/60 backdrop-blur-md transition-all">
      <div className="w-full sm:max-w-xl bg-surface border border-edge rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[85vh] sm:max-h-[80vh] flex flex-col">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-edge pb-3 shrink-0">
          <h2 className="font-display font-bold text-lg sm:text-xl text-ink truncate">
            Terms of Service & Rules
          </h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-canvas hover:bg-edge/50 flex items-center justify-center text-mute hover:text-ink text-base transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="text-xs sm:text-sm text-mute leading-relaxed space-y-3.5 font-sans overflow-y-auto py-4 pr-1">
          <p>
            <strong className="text-ink block sm:inline font-semibold">1. Placement & Bidding: </strong> 
            Bids allow your channel to hold a temporary position on the board. Other users can outbid your rank by paying the minimum required amount.
          </p>
          <p>
            <strong className="text-ink block sm:inline font-semibold">2. Refund Policy: </strong> 
            All transactions processed via Razorpay are final and non-refundable once placement is confirmed on the leaderboard.
          </p>
          <p>
            <strong className="text-ink block sm:inline font-semibold">3. Prohibited Content: </strong> 
            We reserve the right to remove channels containing hate speech, illegal material, explicit content, or fraudulent links without notice or refund.
          </p>
          <p>
            <strong className="text-ink block sm:inline font-semibold">4. Disclaimer: </strong> 
            BidTuber is an independent platform and is not affiliated with, authorized, or endorsed by YouTube or Google LLC.
          </p>
        </div>

        {/* Action CTA */}
        <div className="pt-3 border-t border-edge shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-brand text-white font-semibold text-xs sm:text-sm hover:bg-brand/90 active:scale-[0.99] transition-all shadow-md shadow-brand/20"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
}