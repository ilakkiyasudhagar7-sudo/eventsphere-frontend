// src/pages/Events.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { getEvents } from "../api/events";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["All", "Draft", "Published", "Ongoing", "Completed", "Cancelled"];

const fmtDate = (d) => {
  const date = new Date(d);
  return isNaN(date) ? String(d) : date.toLocaleDateString("en-IN", { dateStyle: "medium" });
};

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    const q = query.toLowerCase();
    const matchesText =
      e.EventTitle.toLowerCase().includes(q) || String(e.EventCategory ?? "").toLowerCase().includes(q);
    const matchesStatus = status === "All" || e.EventStatus === status;
    return matchesText && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-white">Events</h1>
        {user.role === "Organizer" && (
          <Link
            to="/events/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-sm font-medium transition"
          >
            <Plus size={16} /> Add event
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or category..."
            className="pl-9 pr-3 py-2 rounded-lg ring-1 ring-edge w-64"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-lg ring-1 ring-edge"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === "All" ? "All statuses" : s}</option>
          ))}
        </select>
      </div>

      <div className="bg-card ring-1 ring-edge rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 border-b border-edge">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Start</th>
              <th className="px-4 py-3 font-medium">End</th>
              <th className="px-4 py-3 font-medium">Capacity</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Loading events...</td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-red-300">{error}</td>
              </tr>
            )}
            {!loading &&
              !error &&
              filtered.map((e) => (
                <tr key={e.EventID} className="border-b border-edge last:border-0 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <Link to={`/events/${e.EventID}`} className="text-pink-400 hover:text-pink-300 font-medium">
                      {e.EventTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{e.EventCategory ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-300">{fmtDate(e.StartDate)}</td>
                  <td className="px-4 py-3 text-gray-300">{fmtDate(e.EndDate)}</td>
                  <td className="px-4 py-3 text-gray-300">{e.Capacity ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={e.EventStatus} /></td>
                </tr>
              ))}
            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No events match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}