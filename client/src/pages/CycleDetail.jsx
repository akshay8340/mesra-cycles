import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CycleDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cycle, setCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchCycle = async () => {
      try {
        const { data } = await api.get(`/cycles/${id}`);
        setCycle(data);
      } catch (err) {
        setError("Cycle not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchCycle();
  }, [id]);

  const estimatedHours =
    startTime && endTime
      ? Math.max(1, Math.ceil((new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60)))
      : 0;
  const estimatedCost = cycle ? estimatedHours * cycle.pricePerHour : 0;

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!user) {
      navigate("/login");
      return;
    }
    if (!startTime || !endTime) {
      setError("Please select start and end time.");
      return;
    }
    if (new Date(endTime) <= new Date(startTime)) {
      setError("End time must be after start time.");
      return;
    }

    setBooking(true);
    try {
      await api.post("/bookings", { cycleId: id, startTime, endTime });
      setMessage("Booking request sent! Check 'My Bookings' for status.");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create booking.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <p className="text-center py-20 text-ink/60">Loading...</p>;
  if (error && !cycle) return <p className="text-center py-20 text-clay">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-2 gap-10">
      <div>
        <div className="h-80 bg-white rounded-2xl border border-forest/10 overflow-hidden">
          {cycle.photo ? (
            <img src={cycle.photo} alt={cycle.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">🚲</div>
          )}
        </div>
        <h1 className="font-display text-3xl font-bold text-forest mt-6">{cycle.title}</h1>
        <p className="text-ink/60 mt-2">{cycle.description || "No description provided."}</p>
        <div className="mt-4 space-y-2 text-sm text-ink/70">
          <p>📍 Pickup: <span className="font-medium">{cycle.location}</span></p>
          <p>👤 Owner: <span className="font-medium">{cycle.owner?.name}</span> ({cycle.owner?.hostel})</p>
          <p>💰 Price: <span className="font-bold text-amber-dark">₹{cycle.pricePerHour}/hour</span></p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-forest/10 p-6 h-fit">
        <h2 className="font-display text-xl font-bold text-forest mb-4">Book this cycle</h2>

        {message && <div className="bg-forest/10 text-forest text-sm px-4 py-2 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-clay/10 text-clay text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-forest">Start Time</label>
            <input
              type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-forest">End Time</label>
            <input
              type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>

          {estimatedHours > 0 && (
            <div className="bg-sage rounded-lg px-4 py-3 text-sm text-forest">
              Estimated: <span className="font-bold">{estimatedHours} hr(s)</span> = <span className="font-bold">₹{estimatedCost}</span>
            </div>
          )}

          <button
            type="submit" disabled={booking || !cycle.isAvailable}
            className="w-full bg-amber hover:bg-amber-dark text-forest font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {!cycle.isAvailable ? "Currently Unavailable" : booking ? "Sending request..." : "Request Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CycleDetail;
