const Footer = () => {
  return (
    <footer className="bg-forest text-sage/80 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-display font-bold text-lg text-sage">
          <span className="w-7 h-7 rounded-full bg-amber text-forest flex items-center justify-center text-sm">🚲</span>
          MesraCycles
        </div>
        <p className="text-sm text-center">
          Built by a BIT Mesra student, for BIT Mesra students. Peer-to-peer cycle rentals across campus.
        </p>
        <p className="text-xs text-sage/50">&copy; {new Date().getFullYear()} MesraCycles</p>
      </div>
    </footer>
  );
};

export default Footer;
