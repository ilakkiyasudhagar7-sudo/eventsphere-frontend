// src/pages/AddEvent.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { getVenues } from "../api/venues";
import { createEvent } from "../api/events";

const emptyForm = {
  EventTitle: "",
  EventDescription: "",
  EventCategory: "",
  StartDate: "",
  EndDate: "",
  Capacity: "",
  EventStatus: "Draft",
  VenueID: "",
};

export default function AddEvent() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getVenues().then(setVenues);
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const venue = venues.find((v) => v.VenueID === Number(form.VenueID));
  const overCapacity = venue && form.Capacity !== "" && Number(form.Capacity) > venue.Capacity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const ev = await createEvent(form);
      navigate(`/events/${ev.EventID}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg ring-1 ring-edge";
  const labelCls = "block text-sm text-gray-400 mb-1";

  return (
    <div className="max-w-3xl">
      <Link to="/events" className="text-pink-400 hover:text-pink-300 inline-flex items-center gap-1 mb-4 text-sm">
        <ArrowLeft size={16} /> Back to events
      </Link>
      <h1 className="text-2xl font-semibold text-white mb-6">Add event</h1>

      <form onSubmit={handleSubmit} className="bg-card ring-1 ring-edge rounded-xl p-6 space-y-4">
        {error && (
          <div className="text-sm text-red-300 bg-red-500/10 ring-1 ring-red-500/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div>
          <label className={labelCls}>Event title</label>
          <input required value={form.EventTitle} onChange={set("EventTitle")} className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            required
            rows={3}
            value={form.EventDescription}
            onChange={set("EventDescription")}
            className={`${inputCls} bg-card text-gray-100`}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Category</label>
            <input
              required
              list="category-options"
              value={form.EventCategory}
              onChange={set("EventCategory")}
              className={inputCls}
              placeholder="e.g. Conference"
            />
            <datalist id="category-options">
              <option value="Conference" />
              <option value="Workshop" />
              <option value="Seminar" />
              <option value="Meetup" />
              <option value="Concert" />
              <option value="Festival" />
            </datalist>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.EventStatus} onChange={set("EventStatus")} className={inputCls}>
              <option>Draft</option>
              <option>Published</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Ongoing and Completed are set automatically from the dates.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Start date</label>
            <input type="date" required value={form.StartDate} onChange={set("StartDate")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>End date</label>
            <input
              type="date"
              required
              min={form.StartDate || undefined}
              value={form.EndDate}
              onChange={set("EndDate")}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Venue</label>
            <select required value={form.VenueID} onChange={set("VenueID")} className={inputCls}>
              <option value="">Select a venue...</option>
              {venues.map((v) => (
                <option key={v.VenueID} value={v.VenueID}>
                  {v.VenueName} ({v.City}), capacity {v.Capacity}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Event capacity</label>
            <input
              type="number"
              min="1"
              required
              value={form.Capacity}
              onChange={set("Capacity")}
              className={inputCls}
            />
            {venue && !overCapacity && (
              <p className="text-xs text-gray-500 mt-1">Venue capacity: {venue.Capacity}</p>
            )}
          </div>
        </div>

        {overCapacity && (
          <div className="flex gap-2 text-sm text-pink-300 bg-pink-500/10 ring-1 ring-pink-500/30 rounded-lg px-3 py-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>
              Capacity ({form.Capacity}) exceeds the venue's capacity ({venue.Capacity}). Reduce the
              capacity or choose a larger venue.
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving || overCapacity}
          className="px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white text-sm font-medium transition"
        >
          {saving ? "Creating..." : "Create event"}
        </button>
      </form>
    </div>
  );
}