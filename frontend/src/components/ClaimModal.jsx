import { useEffect, useState } from "react";
import { getQuote, createClaimOrder, verifyPayment, lookupYoutubeChannel } from "../lib/api.js";

const rupees = (paise) => (paise / 100).toLocaleString("en-IN");

export default function ClaimModal({ open, targetRank, initialHandle, categories, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    url: "",
    thumbnailUrl: "",
    description: "",
    category: categories[0] || "Other",
    subscribers: "",
  });
  const [quote, setQuote] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | quoting | paying | error
  const [error, setError] = useState("");
  const [handle, setHandle] = useState("");
  const [lookupStatus, setLookupStatus] = useState("idle"); // idle | loading | done | error
  const [lookupError, setLookupError] = useState("");

  useEffect(() => {
    if (!open || !targetRank) return;
    setStatus("quoting");
    getQuote(targetRank)
      .then((q) => {
        setQuote(q);
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }, [open, targetRank]);

  useEffect(() => {
    if (open && initialHandle) {
      setHandle(initialHandle);
      fetchFromHandle(initialHandle);
    }
  }, [open, initialHandle]);

  if (!open) return null;

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const fetchFromHandle = async (targetHandle = handle) => {
    const cleanHandle = targetHandle.trim();
    if (!cleanHandle) return;

    setLookupStatus("loading");
    setLookupError("");
    try {
      const info = await lookupYoutubeChannel(cleanHandle);
      setForm((f) => ({
        ...f,
        name: info.name || f.name,
        url: info.url || f.url,
        thumbnailUrl: info.thumbnailUrl || f.thumbnailUrl,
        subscribers: info.subscribers || f.subscribers,
      }));
      setLookupStatus("done");
    } catch (err) {
      setLookupError(err?.response?.data?.error || "Could not find that channel.");
      setLookupStatus("error");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.url) {
      setError("Channel name and URL are required.");
      return;
    }
    setStatus("paying");

    try {
      const order = await createClaimOrder({ ...form, targetRank });

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency,
        name: "BidTuber",
        description: `Claim rank #${order.targetRank} for ${form.name}`,
        order_id: order.orderId,
        theme: { color: "#4F46E5" },
        handler: async (response) => {
          try {
            const result = await verifyPayment({
              orderId: order.orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            onSuccess(result);
          } catch (err) {
            setError("Payment succeeded but we could not confirm placement. Contact support with your payment ID.");
            setStatus("error");
          }
        },
        modal: {
          ondismiss: () => setStatus("idle"),
        },
      });

      rzp.open();
    } catch (err) {
      setError(err?.response?.data?.error || "Could not start payment. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/60 backdrop-blur-md transition-all">
      <div className="w-full sm:max-w-lg bg-surface border border-edge rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-edge">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm bg-brand/10 text-brand px-2.5 py-1 rounded-full border border-brand/20">
              Rank #{targetRank}
            </span>
            <h2 className="font-display font-bold text-xl text-ink">
              Claim Placement
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-canvas hover:bg-edge/50 flex items-center justify-center text-mute hover:text-ink text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Pricing Summary Box */}
        {quote && (
          <div className="mt-4 p-3.5 bg-priceSoft/50 border border-price/20 rounded-xl flex items-center justify-between">
            <span className="text-xs text-mute font-medium">Placement Fee</span>
            <span className="font-mono text-price font-extrabold text-lg">
              ₹{rupees(quote.amountPaise)}
            </span>
          </div>
        )}

        {/* Auto Fetch Section */}
        <div className="mt-5 space-y-2">
          <label className="text-[11px] uppercase tracking-wider font-mono font-semibold text-mute block">
            Auto-fill from YouTube
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                placeholder="@handle or channel URL"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), fetchFromHandle())}
                className="w-full bg-canvas border border-edge focus:border-brand outline-none rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-mute/60 transition"
              />
            </div>
            <button
              type="button"
              onClick={() => fetchFromHandle()}
              disabled={lookupStatus === "loading" || !handle.trim()}
              className="px-4 py-2.5 rounded-xl bg-brand/10 border border-brand/20 text-brand hover:bg-brand hover:text-white text-sm font-semibold transition-all disabled:opacity-50 shrink-0 flex items-center gap-2"
            >
              {lookupStatus === "loading" ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                  Fetching
                </>
              ) : (
                "Fetch"
              )}
            </button>
          </div>

          {lookupStatus === "done" && (
            <div className="mt-2 p-3 bg-canvas border border-edge rounded-xl flex items-center gap-3">
              {form.thumbnailUrl ? (
                <img src={form.thumbnailUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-edge" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-surface border border-edge flex items-center justify-center font-mono text-xs font-bold text-mute">
                  {form.name?.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-ink truncate">{form.name}</p>
                <p className="text-[11px] text-mute truncate">{form.subscribers ? `${form.subscribers} subscribers` : form.url}</p>
              </div>
              <span className="text-[10px] bg-online/10 text-online border border-online/20 px-2 py-0.5 rounded-full font-semibold">
                Verified
              </span>
            </div>
          )}

          {lookupStatus === "error" && (
            <p className="text-xs text-red-500 font-medium">{lookupError}</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="mt-5 space-y-3.5">
          <div>
            <label className="text-xs font-medium text-mute mb-1 block">Channel Name *</label>
            <input
              required
              placeholder="e.g. Marques Brownlee"
              value={form.name}
              onChange={update("name")}
              className="w-full bg-canvas border border-edge focus:border-brand outline-none rounded-xl px-3.5 py-2.5 text-sm text-ink transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-mute mb-1 block">Channel URL *</label>
            <input
              required
              type="url"
              placeholder="https://youtube.com/@mkbhd"
              value={form.url}
              onChange={update("url")}
              className="w-full bg-canvas border border-edge focus:border-brand outline-none rounded-xl px-3.5 py-2.5 text-sm text-ink transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-mute mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={update("category")}
                className="w-full bg-canvas border border-edge focus:border-brand outline-none rounded-xl px-3 py-2.5 text-sm text-ink transition"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-mute mb-1 block">Subscribers (optional)</label>
              <input
                placeholder="e.g. 18.5M"
                value={form.subscribers}
                onChange={update("subscribers")}
                className="w-full bg-canvas border border-edge focus:border-brand outline-none rounded-xl px-3.5 py-2.5 text-sm text-ink transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-mute mb-1 block">Thumbnail URL (optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.thumbnailUrl}
              onChange={update("thumbnailUrl")}
              className="w-full bg-canvas border border-edge focus:border-brand outline-none rounded-xl px-3.5 py-2.5 text-sm text-ink transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-mute mb-1 block">Short Pitch / Bio (optional)</label>
            <textarea
              placeholder="What is your channel about in 1 sentence?"
              value={form.description}
              onChange={update("description")}
              rows={2}
              className="w-full bg-canvas border border-edge focus:border-brand outline-none rounded-xl px-3.5 py-2.5 text-sm text-ink resize-none transition"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "paying" || status === "quoting"}
            className="w-full mt-2 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand/90 active:scale-[0.99] transition-all disabled:opacity-50 shadow-lg shadow-brand/20 flex items-center justify-center gap-2"
          >
            {status === "paying" ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Opening Razorpay...
              </>
            ) : quote ? (
              `Pay ₹${rupees(quote.amountPaise)} & Claim Rank #${targetRank}`
            ) : (
              "Fetching Pricing..."
            )}
          </button>
        </form>
      </div>
    </div>
  );
}