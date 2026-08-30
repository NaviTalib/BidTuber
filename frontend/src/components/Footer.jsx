import { useState } from "react";
import TermsModal from "./TermsModal.jsx";

export default function Footer() {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <footer className="border-t border-edge bg-surface py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mute">
          <p>© {new Date().getFullYear()} BidTuber. All rights reserved.</p>

          <div className="flex items-center gap-4 font-medium">
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="hover:text-ink transition-colors underline"
            >
              Terms of Service & Rules
            </button>
          </div>
        </div>
      </footer>

      {/* Terms Modal instance for Footer */}
      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
    </>
  );
}