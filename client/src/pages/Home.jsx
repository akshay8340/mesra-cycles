import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block bg-amber/20 text-amber-dark font-semibold px-3 py-1 rounded-full text-sm mb-4">
            Built for BIT Mesra campus
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-forest leading-tight">
            Late for class? <br /> Rent a cycle from a hostel-mate.
          </h1>
          <p className="mt-5 text-ink/70 text-lg">
            Hostel to main building is a good 1–1.5 km walk. MesraCycles connects students who own a
            cycle with students who need one right now — for class, or an evening ride around campus.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/browse"
              className="bg-forest hover:bg-forest-light text-sage font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Find a Cycle
            </Link>
            <Link
              to="/add-cycle"
              className="border border-forest/30 hover:bg-white text-forest font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              List Your Cycle
            </Link>
          </div>
        </div>
        <div className="bg-forest rounded-3xl p-10 text-sage relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber/20 rounded-full"></div>
          <div className="relative">
            <p className="font-display text-2xl font-bold mb-6">How it works</p>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="w-7 h-7 shrink-0 rounded-full bg-amber text-forest font-bold flex items-center justify-center text-sm">1</span>
                <span>Browse cycles listed by students near your hostel.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-7 h-7 shrink-0 rounded-full bg-amber text-forest font-bold flex items-center justify-center text-sm">2</span>
                <span>Pick a time slot and send a booking request.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-7 h-7 shrink-0 rounded-full bg-amber text-forest font-bold flex items-center justify-center text-sm">3</span>
                <span>Owner accepts, you meet up, ride, and pay directly (cash/UPI).</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="bg-white border-y border-forest/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-3 gap-8">
          <div>
            <div className="text-3xl mb-3">⏱️</div>
            <h3 className="font-display font-bold text-forest text-lg mb-1">Save time</h3>
            <p className="text-ink/60 text-sm">
              No more sprinting from hostel to class. Grab a cycle from someone free that hour.
            </p>
          </div>
          <div>
            <div className="text-3xl mb-3">💸</div>
            <h3 className="font-display font-bold text-forest text-lg mb-1">Earn a little</h3>
            <p className="text-ink/60 text-sm">
              Your cycle sits idle during your classes anyway — list it and earn some pocket money.
            </p>
          </div>
          <div>
            <div className="text-3xl mb-3">🌆</div>
            <h3 className="font-display font-bold text-forest text-lg mb-1">Evening rides</h3>
            <p className="text-ink/60 text-sm">
              Want to explore campus in the evening? Rent a cycle for an hour or two, hassle-free.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
