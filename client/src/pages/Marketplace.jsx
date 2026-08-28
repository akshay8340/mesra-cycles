import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import api from "../api/axios";
import CycleCard from "../components/CycleCard";

const Marketplace = () => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const { data } = await api.get("/cycles", { params: { type: "sell" } });
        setCycles(data);
      } catch (err) {
        setError("Could not load listings. Please try again.");
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
        <div>
          <h1 className="font-display text-3xl font-bold text-forest">Marketplace</h1>
          <p className="text-ink/60 text-sm mt-1">
            Buy or sell a cycle outright — great for graduating seniors passing theirs on.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-forest/20 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-amber"
          />
          <Link
            to="/add-cycle"
            className="whitespace-nowrap bg-amber hover:bg-amber-dark text-forest font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Sell Yours
          </Link>
        </div>
      </div>

      {loading && <p className="text-ink/60">Loading listings...</p>}
      {error && <p className="text-clay">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-forest/10">
          <ShoppingBag size={40} strokeWidth={1.5} className="mx-auto mb-3 text-forest/30" />
          <p className="text-ink/60">No cycles for sale right now. Check back later!</p>
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

export default Marketplace;
