// src/pages/Feedback.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMySessions, getAllFeedback, submitFeedback } from "../api/feedback";

const fmtDate = (d) => {
  const date = new Date(d);
  return isNaN(date) ? String(d) : date.toLocaleDateString("en-IN", { dateStyle: "medium" });
};
const fmtTime = (d) => {
  const date = new Date(d);
  return isNaN(date) ? String(d) : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

function Stars({ value }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={14} className={n <= value ? "text-pink-400 fill-pink-400" : "text-gray-600"} />
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <span className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} stars`}>
          <Star
            size={24}
            className={n <= value ? "text-pink-400 fill-pink-400" : "text-gray-600 hover:text-pink-300"}
          />
        </button>
      ))}
    </span>
  );
}

function SessionCard({ s, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await submitFeedback(s.SessionID, { Rating: rating, Comments: comments });
      onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card ring-1 ring-edge rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-white font-medium">{s.SessionTitle}</h3>
          <p className="text-xs text-gray-400">
            {s.EventTitle} · {fmtTime(s.StartTime)}
          </p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300">{s.SessionType}</span>
      </div>

      {s.MyFeedback ? (
        <div className="mt-3 border-t border-edge pt-3 text-sm">
          <div className="flex items-center justify-between">
            <Stars value={s.MyFeedback.Rating} />
            <span className="text-xs text-emerald-300">Submitted {fmtDate(s.MyFeedback.FeedbackDate)}</span>
          </div>
          {s.MyFeedback.Comments && <p className="text-gray-300 mt-1">{s.MyFeedback.Comments}</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 border-t border-edge pt-3 space-y-3">
          {error && (
            <div className="text-sm text-red-300 bg-red-500/10 ring-1 ring-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={2}
            placeholder="Comments (optional)"
            className="w-full px-3 py-2 rounded-lg ring-1 ring-edge text-sm bg-card text-gray-100"
          />
          <button
            type="submit"
            disabled={saving || rating === 0}
            className="px-4 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white text-sm transition"
          >
            {saving ? "Submitting..." : "Submit feedback"}
          </button>
        </form>
      )}
    </div>
  );
}

function AttendeeView() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setSessions(await getMySessions());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="text-gray-500">Loading sessions...</p>;

  if (sessions.length === 0) {
    return (
      <div className="bg-card ring-1 ring-edge rounded-xl p-6 text-gray-400">
        You can give feedback on sessions of events you've registered for. You have none yet.{" "}
        <Link to="/registrations" className="text-pink-400 hover:text-pink-300">
          Register for an event
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {sessions.map((s) => (
        <SessionCard key={s.SessionID} s={s} onSubmitted={load} />
      ))}
    </div>
  );
}

function OrganizerView() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllFeedback().then((r) => {
      setRows(r);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-gray-500">Loading feedback...</p>;

  const avg = rows.length ? rows.reduce((a, r) => a + r.Rating, 0) / rows.length : 0;

  return (
    <div>
      <div className="bg-card ring-1 ring-edge rounded-xl p-4 mb-4 flex items-center gap-4">
        <div>
          <p className="text-xs text-gray-400">Average rating</p>
          <p className="text-2xl font-semibold text-white">{rows.length ? avg.toFixed(1) : "-"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Total responses</p>
          <p className="text-2xl font-semibold text-white">{rows.length}</p>
        </div>
      </div>

      <div className="bg-card ring-1 ring-edge rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 border-b border-edge">
            <tr>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Session</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Comments</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.FeedbackID} className="border-b border-edge last:border-0 hover:bg-white/5">
                <td className="px-4 py-3 text-gray-300">{f.EventTitle}</td>
                <td className="px-4 py-3 text-gray-300">{f.SessionTitle}</td>
                <td className="px-4 py-3"><Stars value={f.Rating} /></td>
                <td className="px-4 py-3 text-gray-300">{f.Comments}</td>
                <td className="px-4 py-3 text-gray-400">{fmtDate(f.FeedbackDate)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No feedback yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Feedback() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Feedback</h1>
      {user.role === "Organizer" ? <OrganizerView /> : <AttendeeView />}
    </div>
  );
}