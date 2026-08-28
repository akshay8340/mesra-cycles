import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bike, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const linkClass =
    "text-forest/80 hover:text-forest font-medium transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-sage/95 backdrop-blur border-b border-forest/10">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl text-forest">
          <span className="w-8 h-8 rounded-full bg-forest text-sage flex items-center justify-center">
            <Bike size={17} strokeWidth={2.5} />
          </span>
          MesraCycles
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/browse" className={linkClass}>Rent a Cycle</Link>
          <Link to="/marketplace" className={linkClass}>Marketplace</Link>
          {user && <Link to="/add-cycle" className={linkClass}>List a Cycle</Link>}
          {user && <Link to="/my-bookings" className={linkClass}>My Bookings</Link>}
          {user && user.role === "admin" && <Link to="/admin" className={linkClass}>Admin</Link>}

          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className={linkClass}>Login</Link>
              <Link
                to="/signup"
                className="bg-amber hover:bg-amber-dark text-forest font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NotificationBell />
              <span className="text-sm text-forest/70">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="border border-forest/30 hover:bg-forest hover:text-sage text-forest px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-1">
          {user && <NotificationBell />}
          <button
            className="text-forest w-9 h-9 flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-sage border-t border-forest/10 px-4 py-4 flex flex-col gap-3">
          <Link to="/browse" onClick={() => setMenuOpen(false)} className={linkClass}>Rent a Cycle</Link>
          <Link to="/marketplace" onClick={() => setMenuOpen(false)} className={linkClass}>Marketplace</Link>
          {user && <Link to="/add-cycle" onClick={() => setMenuOpen(false)} className={linkClass}>List a Cycle</Link>}
          {user && <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className={linkClass}>My Bookings</Link>}
          {user && user.role === "admin" && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className={linkClass}>Admin</Link>
          )}
          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className={linkClass}>Login</Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="bg-amber text-forest font-semibold px-4 py-2 rounded-lg text-center"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="border border-forest/30 text-forest px-4 py-2 rounded-lg text-sm font-medium text-left"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
