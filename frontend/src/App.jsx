import { useEffect, useState, useCallback } from "react";
import Header from "./components/Header.jsx";
import HeroClaim from "./components/HeroClaim.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ListingRow from "./components/ListingRow.jsx";
import ClaimModal from "./components/ClaimModal.jsx";
import MovementFeed from "./components/MovementFeed.jsx";
import Footer from "./components/Footer.jsx";
import { getLeaderboard, getCategories, getMovements } from "./lib/api.js";

export default function App() {
  const [period, setPeriod] = useState("alltime");
  const [category, setCategory] = useState("all");
  
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [movements, setMovements] = useState([]);
  const [stats, setStats] = useState({ onlineNow: 0, totalVerifiedPaise: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const [modalRank, setModalRank] = useState(null);
  const [modalHandle, setModalHandle] = useState("");

  // Fetch initial category list once
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  // Fetch main dashboard data with race condition protection
  const refresh = useCallback(() => {
    let isSubscribed = true;
    setIsLoading(true);

    Promise.all([
      getLeaderboard(period, category),
      getMovements()
    ])
      .then(([leaderboardData, movementsData]) => {
        if (!isSubscribed) return;
        setChannels(leaderboardData.channels);
        setStats({
          onlineNow: leaderboardData.onlineNow,
          totalVerifiedPaise: leaderboardData.totalVerifiedPaise,
        });
        setMovements(movementsData);
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

  const openClaim = (rank, handle = "") => {
    setModalHandle(handle);
    // Defaults to next available rank if rank isn't provided explicitly
    const nextRank = channels.length ? channels[channels.length - 1].rank + 1 : 1;
    setModalRank(rank ?? nextRank);
  };

  const handleSuccess = () => {
    setModalRank(null);
    refresh();
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Header period={period} onPeriodChange={setPeriod} onlineNow={stats.onlineNow} />
      <HeroClaim totalVerifiedPaise={stats.totalVerifiedPaise} onOpenClaim={openClaim} />

      <section id="board" className="max-w-6xl mx-auto px-5 pb-16 flex flex-col sm:flex-row gap-8">
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
              {channels.map((c) => (
                <ListingRow key={c.id} channel={c} onClaimClick={openClaim} />
              ))}
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
        categories={categories.length ? categories : ["Other"]}
        onClose={() => setModalRank(null)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}