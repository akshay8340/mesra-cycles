import { Link } from "react-router-dom";

const CycleCard = ({ cycle }) => {
  return (
    <Link
      to={`/cycles/${cycle._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-forest/10 hover:border-amber hover:shadow-lg transition-all"
    >
      <div className="h-44 bg-forest/5 overflow-hidden">
        {cycle.photo ? (
          <img
            src={cycle.photo}
            alt={cycle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🚲</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-bold text-forest text-lg truncate">{cycle.title}</h3>
        <p className="text-sm text-ink/60 mt-1">📍 {cycle.location}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-amber-dark font-bold">₹{cycle.pricePerHour}/hr</span>
          <span className="text-xs bg-sage text-forest px-2 py-1 rounded-full">
            {cycle.owner?.name?.split(" ")[0] || "Owner"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CycleCard;
