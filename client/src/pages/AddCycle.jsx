import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Video } from "lucide-react";
import api from "../api/axios";

const AddCycle = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const initialType = new URLSearchParams(routerLocation.search).get("type") === "sell" ? "sell" : "rent";

  const [listingType, setListingType] = useState(initialType);
  const [form, setForm] = useState({ title: "", description: "", pricePerHour: "", price: "", location: "" });
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - photos.length);
    if (files.length === 0) return;
    setPhotos((prev) => [...prev, ...files].slice(0, 5));
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 5));
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("listingType", listingType);
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("location", form.location);
      if (listingType === "rent") data.append("pricePerHour", form.pricePerHour);
      else data.append("price", form.price);
      photos.forEach((p) => data.append("photos", p));
      if (video) data.append("video", video);

      await api.post("/cycles", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(listingType === "sell" ? "/marketplace" : "/browse");
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
        <p className="text-ink/60 text-sm mb-6">
          Renting it out during class hours, or passing it on to a junior? Either way, list it here.
        </p>

        <div className="flex bg-sage rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setListingType("rent")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              listingType === "rent" ? "bg-forest text-sage" : "text-forest/60"
            }`}
          >
            Rent it out
          </button>
          <button
            type="button"
            onClick={() => setListingType("sell")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              listingType === "sell" ? "bg-forest text-sage" : "text-forest/60"
            }`}
          >
            Sell it
          </button>
        </div>

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
              <label className="text-sm font-medium text-forest">
                {listingType === "rent" ? "Price / hour (₹)" : "Asking Price (₹)"}
              </label>
              {listingType === "rent" ? (
                <input
                  type="number" name="pricePerHour" min="1" required value={form.pricePerHour} onChange={handleChange}
                  className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
                  placeholder="20"
                />
              ) : (
                <input
                  type="number" name="price" min="1" required value={form.price} onChange={handleChange}
                  className="mt-1 w-full border border-forest/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber"
                  placeholder="2500"
                />
              )}
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
            <label className="text-sm font-medium text-forest">Photos (up to 5)</label>
            <input
              type="file" accept="image/*" multiple onChange={handlePhotos}
              disabled={photos.length >= 5}
              className="mt-1 w-full text-sm"
            />
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {previews.map((src, i) => (
                  <div key={src} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-forest flex items-center gap-1.5">
              <Video size={15} /> Video (optional)
            </label>
            <input type="file" accept="video/*" onChange={handleVideo} className="mt-1 w-full text-sm" />
            {videoPreview && (
              <video src={videoPreview} controls className="mt-3 h-32 rounded-lg" />
            )}
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
