import { Link } from "react-router-dom";
import { Bike } from "lucide-react";

const NotFound = () => (
  <div className="text-center py-24">
    <Bike size={56} strokeWidth={1.5} className="mx-auto mb-4 text-forest/30" />
    <h1 className="font-display text-2xl font-bold text-forest">Page not found</h1>
    <p className="text-ink/60 mt-2">Looks like this page rode off somewhere.</p>
    <Link to="/" className="inline-block mt-6 bg-forest text-sage px-5 py-2.5 rounded-lg font-medium">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
