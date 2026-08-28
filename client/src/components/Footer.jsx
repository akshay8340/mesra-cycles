import { Bike } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-forest text-sage/80 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center gap-5 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:text-left">
        <div className="flex items-center gap-2 font-display font-bold text-lg text-sage shrink-0">
          <span className="w-7 h-7 rounded-full bg-amber text-forest flex items-center justify-center shrink-0">
            <Bike size={15} strokeWidth={2.5} />
          </span>
          MesraCycles
        </div>

        <p className="text-sm leading-relaxed max-w-xs lg:max-w-sm">
          Built by a BIT Mesra student, for BIT Mesra students — peer-to-peer cycle rentals across campus.
        </p>

        <div className="w-full pt-4 border-t border-sage/10 lg:w-auto lg:pt-0 lg:border-t-0 lg:shrink-0">
          <p className="text-xs text-sage/50 leading-relaxed">
            &copy; {new Date().getFullYear()} MesraCycles
          </p>
          <p className="text-xs text-sage/50 leading-relaxed">
            Designed &amp; built by Akshay Mishra
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;