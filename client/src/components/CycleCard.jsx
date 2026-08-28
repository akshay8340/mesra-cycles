import { Link } from "react-router-dom";
import { Bike, MapPin } from "lucide-react";

const CycleCard = ({ cycle }) => {
  const cover = cycle.photos?.[0];
  const isSell = cycle.listingType === "sell";

  return (
    <Link
      to={`/cycles/${cycle._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-forest/10 hover:border-amber hover:shadow-lg transition-all"
    >
      <div className="h-44 bg-forest/5 overflow-hidden relative">
        {isSell && (
          <span className="absolute top-3 left-3 z-10 bg-clay text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            For Sale
          </span>
        )}
        {cover ? (
          <img
            src={cover}
            alt={cycle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-forest/20">
            <Bike size={48} strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-bold text-forest text-lg truncate">{cycle.title}</h3>
        <p className="text-sm text-ink/60 mt-1 flex items-center gap-1">
          <MapPin size={14} className="shrink-0" /> {cycle.location}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-amber-dark font-bold">
            {isSell ? `₹${cycle.price}` : `₹${cycle.pricePerHour}/hr`}
          </span>
          <span className="text-xs bg-sage text-forest px-2 py-1 rounded-full">
            {cycle.owner?.name?.split(" ")[0] || "Owner"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CycleCard;
