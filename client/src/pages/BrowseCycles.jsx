import { useEffect, useState } from "react";
import api from "../api/axios";
import CycleCard from "../components/CycleCard";

const BrowseCycles = () => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const { data } = await api.get("/cycles");
        setCycles(data);
      } catch (err) {
        setError("Could not load cycles. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCycles();
  }, []);

  const filtered = cycles.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl font-bold text-forest">Browse Cycles</h1>
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-forest/20 rounded-lg px-4 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-amber"
        />
      </div>

      {loading && <p className="text-ink/60">Loading cycles...</p>}
      {error && <p className="text-clay">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-forest/10">
          <p className="text-4xl mb-3">🚲</p>
          <p className="text-ink/60">No cycles available right now. Check back later!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cycle) => (
          <CycleCard key={cycle._id} cycle={cycle} />
        ))}
      </div>
    </div>
  );
};

export default BrowseCycles;
