import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import Header from "./components/Header.jsx";
import HeroClaim from "./components/HeroClaim.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ListingRow from "./components/ListingRow.jsx";
import ClaimModal from "./components/ClaimModal.jsx";
import MovementFeed from "./components/MovementFeed.jsx";
import Footer from "./components/Footer.jsx";
import { getLeaderboard, getCategories, getMovements } from "./lib/api.js";

const ITEMS_PER_PAGE = 10;
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function App() {
  const [period, setPeriod] = useState("alltime");
  const [category, setCategory] = useState("all");

  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [movements, setMovements] = useState([]);
  const [stats, setStats] = useState({
    onlineNow: 0,
    totalVerifiedPaise: 0,
    totalVisitors: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const [modalRank, setModalRank] = useState(null);
  const [modalHandle, setModalHandle] = useState("");
  const [modalAmountPaise, setModalAmountPaise] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Initialize WebSockets for real-time live visitors
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("stats_update", (data) => {
      if (typeof data.onlineNow === "number") {
        setStats((prev) => ({ ...prev, onlineNow: data.onlineNow }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const refresh = useCallback(() => {
    let isSubscribed = true;
    setIsLoading(true);

    Promise.all([getLeaderboard(period, category), getMovements()])
      .then(([leaderboardData, movementsData]) => {
        if (!isSubscribed) return;
        setChannels(leaderboardData.channels || []);
        setStats((prev) => ({
          ...prev,
          onlineNow: leaderboardData.onlineNow ?? prev.onlineNow,
          totalVerifiedPaise: leaderboardData.totalVerifiedPaise || 0,
          totalVisitors: leaderboardData.totalVisitors || 0,
        }));
        setMovements(movementsData || []);
      })
      .catch(console.error)
      .finally(() => {
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [period, category]);

  useEffect(() => {
    const cleanup = refresh();
    return cleanup;
  }, [refresh]);

  // Reset to page 1 whenever category or period changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category, period]);

  const openClaim = (rank, handle = "", amountPaise = null) => {
    setModalHandle(handle);
    setModalAmountPaise(amountPaise);
    const nextRank = channels.length ? channels[channels.length - 1].rank + 1 : 1;
    setModalRank(rank ?? nextRank);
  };

  const handleSuccess = () => {
    setModalRank(null);
    setModalHandle(""); // Reset handle state so hero input resets cleanly
    setModalAmountPaise(null);
    setRefreshKey((prev) => prev + 1);
    refresh();
  };

  // Pagination logic
  const totalPages = Math.ceil(channels.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentChannels = channels.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-canvas flex flex-col antialiased selection:bg-brand/20 selection:text-brand">
      <Header
        period={period}
        onPeriodChange={setPeriod}
        onClaimClick={openClaim}
        onlineNow={stats.onlineNow}
      />

      <HeroClaim
        totalVerifiedPaise={stats.totalVerifiedPaise}
        totalVisitors={stats.totalVisitors}
        onlineNow={stats.onlineNow}
        onOpenClaim={openClaim}
        refreshKey={refreshKey}
      />

      <section id="board" className="max-w-6xl mx-auto px-4 sm:px-5 pb-16 flex flex-col sm:flex-row gap-6 sm:gap-8 flex-1 w-full">
        <Sidebar categories={categories} selected={category} onChange={setCategory} />

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="py-16 text-center text-sm text-mute border border-edge rounded-xl">
              Loading ranks...
            </div>
          ) : channels.length === 0 ? (
            <p className="text-center text-mute py-16 text-sm border border-dashed border-edge rounded-xl">
              No channels here yet — be the first to claim a rank.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Map only the 10 channels for current page */}
              {currentChannels.map((c) => (
                <ListingRow key={c.id || c._id || c.rank} channel={c} onClaimClick={openClaim} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-edge pt-4">
              <span className="text-xs text-mute font-mono">
                Page <strong className="text-ink">{currentPage}</strong> of <strong className="text-ink">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-edge bg-surface text-xs font-semibold text-mute hover:text-ink disabled:opacity-40 disabled:hover:text-mute transition-all"
                >
                  ← Previous
                </button>

                {/* Page Number Buttons */}
                <div className="hidden xs:flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                        currentPage === pageNum
                          ? "bg-brand text-white shadow-sm"
                          : "bg-surface border border-edge text-mute hover:text-ink"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-edge bg-surface text-xs font-semibold text-mute hover:text-ink disabled:opacity-40 disabled:hover:text-mute transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          <MovementFeed movements={movements} />
        </div>
      </section>

      <Footer />

      <ClaimModal
        open={modalRank !== null}
        targetRank={modalRank}
        initialHandle={modalHandle}
        initialAmountPaise={modalAmountPaise}
        categories={categories.length ? categories : ["Other"]}
        channels={channels}
        onClose={() => setModalRank(null)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}