import { useEffect, useState } from "react";
import api from "../api/axios";

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl border border-forest/10 p-5">
    <p className="text-sm text-ink/50">{label}</p>
    <p className="font-display text-2xl font-bold text-forest mt-1">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, u, c, b] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/cycles"),
        api.get("/admin/bookings"),
      ]);
      setStats(s.data);
      setUsers(u.data);
      setCycles(c.data);
      setBookings(b.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleBlock = async (id) => {
    await api.put(`/admin/users/${id}/block`);
    fetchData();
  };

  const toggleApprove = async (id) => {
    await api.put(`/admin/cycles/${id}/approve`);
    fetchData();
  };

  const removeCycle = async (id) => {
    if (!confirm("Delete this cycle listing permanently?")) return;
    await api.delete(`/admin/cycles/${id}`);
    fetchData();
  };

  if (loading) return <p className="text-center py-20 text-ink/60">Loading admin panel...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-forest mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Cycles" value={stats.totalCycles} />
        <StatCard label="Total Bookings" value={stats.totalBookings} />
        <StatCard label="Pending" value={stats.pendingBookings} />
        <StatCard label="Completed" value={stats.completedBookings} />
      </div>

      <div className="flex gap-2 mb-6">
        {["overview", "users", "cycles", "bookings"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab === t ? "bg-forest text-sage" : "bg-white border border-forest/10 text-forest/70"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="bg-white rounded-2xl border border-forest/10 p-6 text-ink/70">
          Use the tabs above to manage students, cycle listings, and bookings across the platform.
        </div>
      )}

      {tab === "users" && (
        <div className="bg-white rounded-2xl border border-forest/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sage text-forest text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Hostel</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-forest/5">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.hostel}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${u.isBlocked ? "bg-clay/10 text-clay" : "bg-forest/10 text-forest"}`}>
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleBlock(u._id)} className="text-xs border border-forest/20 px-3 py-1 rounded-lg">
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "cycles" && (
        <div className="bg-white rounded-2xl border border-forest/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sage text-forest text-left">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Price/hr</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((c) => (
                <tr key={c._id} className="border-t border-forest/5">
                  <td className="px-4 py-3">{c.title}</td>
                  <td className="px-4 py-3">{c.owner?.name}</td>
                  <td className="px-4 py-3">₹{c.pricePerHour}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${c.isApproved ? "bg-forest/10 text-forest" : "bg-amber/20 text-amber-dark"}`}>
                      {c.isApproved ? "Approved" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => toggleApprove(c._id)} className="text-xs border border-forest/20 px-3 py-1 rounded-lg">
                      {c.isApproved ? "Hide" : "Approve"}
                    </button>
                    <button onClick={() => removeCycle(c._id)} className="text-xs border border-clay text-clay px-3 py-1 rounded-lg">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "bookings" && (
        <div className="bg-white rounded-2xl border border-forest/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sage text-forest text-left">
              <tr>
                <th className="px-4 py-3">Cycle</th>
                <th className="px-4 py-3">Renter</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t border-forest/5">
                  <td className="px-4 py-3">{b.cycle?.title}</td>
                  <td className="px-4 py-3">{b.renter?.name}</td>
                  <td className="px-4 py-3">{b.owner?.name}</td>
                  <td className="px-4 py-3">₹{b.totalCost}</td>
                  <td className="px-4 py-3 capitalize">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
