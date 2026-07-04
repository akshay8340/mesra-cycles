import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AddCycle = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", pricePerHour: "", location: "" });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (photo) data.append("photo", photo);

      await api.post("/cycles", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/browse");
    } catch (err) {
      setError(err.response?.data?.message || "Could not list cycle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-forest/10 p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-forest mb-1">List your cycle</h1>
        <p className="text-ink/60 text-sm mb-6">Not using it during class hours? Let someone rent it.</p>

        {error && <div className="bg-clay/10 text-clay text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-forest">Cycle Title</label>
            <input
              type="text" name="title" required value={form.title} onChange={handleChange}
              className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
              placeholder="e.g. Hero Sprint - Black"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-forest">Description</label>
            <textarea
              name="description" value={form.description} onChange={handleChange} rows={3}
              className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
              placeholder="Any details — gears, condition, etc."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-forest">Price / hour (₹)</label>
              <input
                type="number" name="pricePerHour" min="1" required value={form.pricePerHour} onChange={handleChange}
                className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
                placeholder="20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-forest">Pickup Location</label>
              <input
                type="text" name="location" required value={form.location} onChange={handleChange}
                className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
                placeholder="e.g. RK Hostel Gate"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-forest">Photo (optional)</label>
            <input type="file" accept="image/*" onChange={handlePhoto} className="mt-1 w-full text-sm" />
            {preview && <img src={preview} alt="preview" className="mt-3 h-32 rounded-lg object-cover" />}
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-forest hover:bg-forest-light text-sage font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Listing..." : "List Cycle"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCycle;
