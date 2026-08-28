import { useEffect, useState } from "react";
import { Bike, MessageCircle } from "lucide-react";
import api from "../api/axios";

const statusColor = {
  pending: "bg-amber/20 text-amber-dark",
  accepted: "bg-forest/10 text-forest",
  rejected: "bg-clay/10 text-clay",
  completed: "bg-forest text-sage",
  cancelled: "bg-ink/10 text-ink/50",
};

const buildWhatsAppLink = (person, cycleTitle) => {
  if (!person?.phone) return null;
  const cleanPhone = person.phone.replace(/\D/g, "");
  const text = encodeURIComponent(`Hi ${person.name}, this is about the "${cycleTitle}" booking on MesraCycles.`);
  return `https://wa.me/91${cleanPhone}?text=${text}`;
};

const BookingRow = ({ booking, isOwnerView, onAction }) => {
  const contactPerson = isOwnerView ? booking.renter : booking.owner;
  const contactUnlocked = ["accepted", "completed"].includes(booking.status) && contactPerson?.phone;
  const whatsappLink = contactUnlocked ? buildWhatsAppLink(contactPerson, booking.cycle?.title) : null;

  return (
    <div className="bg-white border border-forest/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-sage overflow-hidden shrink-0 flex items-center justify-center text-forest/30">
          {booking.cycle?.photos?.[0] ? (
            <img src={booking.cycle.photos[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            <Bike size={24} strokeWidth={1.5} />
          )}
        </div>
        <div>
          <p className="font-semibold text-forest">{booking.cycle?.title}</p>
          <p className="text-sm text-ink/60">
            {isOwnerView ? `Renter: ${booking.renter?.name}` : `Owner: ${booking.owner?.name}`}
          </p>
          <p className="text-xs text-ink/50 mt-1">
            {new Date(booking.startTime).toLocaleString()} → {new Date(booking.endTime).toLocaleString()}
          </p>
          <p className="text-sm font-medium text-amber-dark mt-1">₹{booking.totalCost} ({booking.totalHours} hr)</p>
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#25D366]"
            >
              <MessageCircle size={14} /> Message on WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColor[booking.status]}`}>
          {booking.status}
        </span>

        {isOwnerView && booking.status === "pending" && (
          <div className="flex gap-2">
            <button onClick={() => onAction(booking._id, "accepted")} className="text-xs bg-forest text-sage px-3 py-1.5 rounded-lg">Accept</button>
            <button onClick={() => onAction(booking._id, "rejected")} className="text-xs border border-clay text-clay px-3 py-1.5 rounded-lg">Reject</button>
          </div>
        )}
        {!isOwnerView && booking.status === "pending" && (
          <button onClick={() => onAction(booking._id, "cancelled")} className="text-xs border border-ink/20 text-ink/60 px-3 py-1.5 rounded-lg">Cancel</button>
        )}
        {booking.status === "accepted" && (
          <button onClick={() => onAction(booking._id, "completed")} className="text-xs bg-amber text-forest px-3 py-1.5 rounded-lg">Mark Completed</button>
        )}
      </div>
    </div>
  );
};

const MyBookings = () => {
  const [tab, setTab] = useState("renting");
  const [renting, setRenting] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [mine, recv] = await Promise.all([api.get("/bookings/my"), api.get("/bookings/received")]);
      setRenting(mine.data);
      setReceived(recv.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const list = tab === "renting" ? renting : received;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-forest mb-6">My Bookings</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("renting")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "renting" ? "bg-forest text-sage" : "bg-white border border-forest/10 text-forest/70"}`}
        >
          Cycles I'm Renting
        </button>
        <button
          onClick={() => setTab("received")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "received" ? "bg-forest text-sage" : "bg-white border border-forest/10 text-forest/70"}`}
        >
          Requests for My Cycles
        </button>
      </div>

      {loading && <p className="text-ink/60">Loading...</p>}

      {!loading && list.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-forest/10 text-ink/60">
          No bookings here yet.
        </div>
      )}

      <div className="space-y-4">
        {list.map((b) => (
          <BookingRow key={b._id} booking={b} isOwnerView={tab === "received"} onAction={handleAction} />
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
