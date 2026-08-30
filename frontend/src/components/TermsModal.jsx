export default function TermsModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-surface border border-edge rounded-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b border-edge pb-3">
          <h2 className="font-display font-bold text-xl text-ink">Terms of Service & Rules</h2>
          <button onClick={onClose} className="text-mute hover:text-ink font-bold">✕</button>
        </div>

        <div className="text-xs text-mute leading-relaxed space-y-3 font-sans">
          <p><strong className="text-ink">1. Placement & Bidding:</strong> Bids allow your channel to hold a temporary position on the board. Other users can outbid your rank by paying the minimum required amount.</p>
          <p><strong className="text-ink">2. Refund Policy:</strong> All transactions processed via Razorpay are final and non-refundable once placement is confirmed on the leaderboard.</p>
          <p><strong className="text-ink">3. Prohibited Content:</strong> We reserve the right to remove channels containing hate speech, illegal material, explicit content, or fraudulent links without notice or refund.</p>
          <p><strong className="text-ink">4. Disclaimer:</strong> BidTuber is an independent platform and is not affiliated with, authorized, or endorsed by YouTube or Google LLC.</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand/90 transition"
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
}