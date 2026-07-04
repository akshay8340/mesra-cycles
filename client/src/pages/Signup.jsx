import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", hostel: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form);
      navigate("/browse");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-forest/10 p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-forest mb-1">Create your account</h1>
        <p className="text-ink/60 text-sm mb-6">Use your college email so hostel-mates can trust you.</p>

        {error && (
          <div className="bg-clay/10 text-clay text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-forest">Full Name</label>
            <input
              type="text" name="name" required value={form.name} onChange={handleChange}
              className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
              placeholder="Rahul Kumar"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-forest">Email</label>
            <input
              type="email" name="email" required value={form.email} onChange={handleChange}
              className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
              placeholder="you@bitmesra.ac.in"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-forest">Password</label>
            <input
              type="password" name="password" required minLength={6} value={form.password} onChange={handleChange}
              className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-forest">Phone Number</label>
            <input
              type="tel" name="phone" required value={form.phone} onChange={handleChange}
              className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
              placeholder="9876543210"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-forest">Hostel</label>
            <input
              type="text" name="hostel" required value={form.hostel} onChange={handleChange}
              className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
              placeholder="e.g. RK Hostel"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-forest hover:bg-forest-light text-sage font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-ink/60 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-forest font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
