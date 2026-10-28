// src/pages/Venues.jsx
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getVenues, addVenue } from "../api/venues";

// Set to true once the backend has a "create venue" endpoint and venues.js calls it.
const CREATE_AVAILABLE = false;

const emptyForm = { VenueName: "", Address: "", City: "", State: "", Country: "India", Capacity: "" };

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null); // { type: "ok" | "error", text }

  const load = async () => {
    setLoadError("");
    try {
      const data = await getVenues();
      setVenues(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err.message || "Could not load venues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!CREATE_AVAILABLE) return;
    setMsg(null);
    setSaving(true);
    try {
      const v = await addVenue(form);
      setMsg({ type: "ok", text: `Venue "${v.VenueName}" added` });
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg ring-1 ring-edge";
  const labelCls = "block text-sm text-gray-400 mb-1";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-white">Venues</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setMsg(null);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-sm font-medium transition"
        >
          <Plus size={16} /> {showForm ? "Close form" : "Add venue"}
        </button>
      </div>

      {msg && (
        <div
          className={`mb-4 text-sm rounded-lg px-3 py-2 ring-1 ${
            msg.type === "ok"
              ? "text-emerald-300 bg-emerald-500/10 ring-emerald-500/30"
              : "text-red-300 bg-red-500/10 ring-red-500/30"
          }`}
        >
          {msg.text}
        </div>
      )}

      {loadError && (
        <div className="mb-4 text-sm text-red-300 bg-red-500/10 ring-1 ring-red-500/30 rounded-lg px-3 py-2">
          Could not load venues: {loadError}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card ring-1 ring-edge rounded-xl p-5 mb-6 space-y-4">
          {!CREATE_AVAILABLE && (
            <div className="text-sm text-pink-300 bg-pink-500/10 ring-1 ring-pink-500/30 rounded-lg px-3 py-2">
              Adding venues is not available yet. The backend has no endpoint for creating venues,
              so nothing can be saved from this form.
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Venue name</label>
              <input required value={form.VenueName} onChange={set("VenueName")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Capacity</label>
              <input
                type="number"
                min="1"
                required
                value={form.Capacity}
                onChange={set("Capacity")}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Address</label>
            <input required value={form.Address} onChange={set("Address")} className={inputCls} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>City</label>
              <input required value={form.City} onChange={set("City")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input required value={form.State} onChange={set("State")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <input required value={form.Country} onChange={set("Country")} className={inputCls} />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving || !CREATE_AVAILABLE}
            className="px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 disabled:opacity-60 text-white text-sm font-medium transition"
          >
            {saving ? "Saving..." : "Save venue"}
          </button>
        </form>
      )}

      <div className="bg-card ring-1 ring-edge rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 border-b border-edge">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Venue</th>
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">State</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Capacity</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading venues...</td>
              </tr>
            )}
            {!loading &&
              venues.map((v) => (
                <tr key={v.VenueID} className="border-b border-edge last:border-0 hover:bg-white/5">
                  <td className="px-4 py-3 text-gray-400">{v.VenueID}</td>
                  <td className="px-4 py-3 text-white font-medium">{v.VenueName}</td>
                  <td className="px-4 py-3 text-gray-300">{v.Address}</td>
                  <td className="px-4 py-3 text-gray-300">{v.City}</td>
                  <td className="px-4 py-3 text-gray-300">{v.State ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-300">{v.Country ?? "—"}</td>
                  <td className="px-4 py-3 text-pink-300">{v.Capacity}</td>
                </tr>
              ))}
            {!loading && !loadError && venues.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No venues yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}