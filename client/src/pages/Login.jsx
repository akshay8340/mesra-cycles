import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      navigate(data.role === "admin" ? "/admin" : "/browse");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-forest/10 p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-forest mb-1">Welcome back</h1>
        <p className="text-ink/60 text-sm mb-6">Login to browse or list a cycle.</p>

        {error && (
          <div className="bg-clay/10 text-clay text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              type="password" name="password" required value={form.password} onChange={handleChange}
              className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
              placeholder="Your password"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-forest hover:bg-forest-light text-sage font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-ink/60 text-center mt-6">
          New here?{" "}
          <Link to="/signup" className="text-forest font-semibold">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
