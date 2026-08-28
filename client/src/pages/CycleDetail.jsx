import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bike, MapPin, User, IndianRupee, MessageCircle, Phone } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CycleDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cycle, setCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(false);

  const [contact, setContact] = useState(null);
  const [contactError, setContactError] = useState("");
  const [contactLoading, setContactLoading] = useState(false);

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
      setMessage("Booking request sent! The owner's contact unlocks once they accept — check 'My Bookings'.");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create booking.");
    } finally {
      setBooking(false);
    }
  };

  const handleShowContact = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setContactError("");
    setContactLoading(true);
    try {
      const { data } = await api.get(`/cycles/${id}/contact`);
      setContact(data);
    } catch (err) {
      setContactError(err.response?.data?.message || "Could not load contact details.");
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) return <p className="text-center py-20 text-ink/60">Loading...</p>;
  if (error && !cycle) return <p className="text-center py-20 text-clay">{error}</p>;

  const photos = cycle.photos || [];
  const isSell = cycle.listingType === "sell";
  const whatsappLink = contact?.phone
    ? `https://wa.me/91${contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hi ${contact.name}, I'm interested in your cycle "${cycle.title}" on MesraCycles.`
      )}`
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-2 gap-10">
      <div>
        <div className="h-80 bg-white rounded-2xl border border-forest/10 overflow-hidden">
          {photos.length > 0 ? (
            <img src={photos[activePhoto]} alt={cycle.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-forest/20">
              <Bike size={72} strokeWidth={1.5} />
            </div>
          )}
        </div>

        {photos.length > 1 && (
          <div className="flex gap-2 mt-3">
            {photos.map((p, i) => (
              <button
                key={p}
                onClick={() => setActivePhoto(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  activePhoto === i ? "border-amber" : "border-transparent"
                }`}
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {cycle.video && (
          <video
            src={cycle.video}
            controls
            className="w-full mt-4 rounded-2xl border border-forest/10 bg-black"
          />
        )}

        <h1 className="font-display text-3xl font-bold text-forest mt-6">{cycle.title}</h1>
        <p className="text-ink/60 mt-2">{cycle.description || "No description provided."}</p>
        <div className="mt-4 space-y-2 text-sm text-ink/70">
          <p className="flex items-center gap-2">
            <MapPin size={16} className="text-forest/50 shrink-0" />
            Pickup: <span className="font-medium">{cycle.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <User size={16} className="text-forest/50 shrink-0" />
            Owner: <span className="font-medium">{cycle.owner?.name}</span> ({cycle.owner?.hostel})
          </p>
          <p className="flex items-center gap-2">
            <IndianRupee size={16} className="text-forest/50 shrink-0" />
            Price:{" "}
            <span className="font-bold text-amber-dark">
              {isSell ? `₹${cycle.price}` : `₹${cycle.pricePerHour}/hour`}
            </span>
          </p>
        </div>
      </div>

      {isSell ? (
        <div className="bg-white rounded-2xl border border-forest/10 p-6 h-fit">
          <h2 className="font-display text-xl font-bold text-forest mb-2">Contact the seller</h2>
          <p className="text-sm text-ink/60 mb-4">
            Reach out directly to talk price, condition, and pickup — payment happens in person.
          </p>

          {contactError && <div className="bg-clay/10 text-clay text-sm px-4 py-2 rounded-lg mb-4">{contactError}</div>}

          {!contact ? (
            <button
              onClick={handleShowContact}
              disabled={contactLoading}
              className="w-full bg-forest hover:bg-forest-light text-sage font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Phone size={16} /> {contactLoading ? "Loading..." : "Show Contact Details"}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-sage rounded-lg px-4 py-3 text-sm text-forest">
                <p className="font-semibold">{contact.name}</p>
                <p>{contact.phone}</p>
                <p className="text-forest/70">{contact.hostel}</p>
              </div>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:opacity-90 text-white font-semibold py-2.5 rounded-lg transition-opacity flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} /> Message on WhatsApp
              </a>
            </div>
          )}
        </div>
      ) : (
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
            <p className="text-xs text-ink/50 text-center">
              The owner's WhatsApp and phone unlock once they accept your request.
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default CycleDetail;
