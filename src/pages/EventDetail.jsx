
// src/pages/EventDetail.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Users,
  Star,
  Plus,
  Ban,
} from "lucide-react";

import { getEvent, cancelEvent } from "../api/events";
import { getSessions, addSession, SESSION_TYPES } from "../api/sessions";
import { getTickets, addTicket } from "../api/tickets";
import { getEventFeedback } from "../api/feedback";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

const fmt = (d) => {
  const date = new Date(d);
  return isNaN(date)
    ? String(d)
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

const fmtDate = (d) => {
  const date = new Date(d);
  return isNaN(date)
    ? String(d)
    : date.toLocaleDateString("en-IN", { dateStyle: "medium" });
};

const inputCls =
  "w-full rounded-lg bg-page border border-edge px-3 py-2 text-sm text-white placeholder-gray-500";
const labelCls = "block text-xs text-gray-400 mb-1";

function Stars({ value }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={
            n <= value
              ? "text-pink-400 fill-pink-400"
              : "text-gray-600"
          }
        />
      ))}
    </span>
  );
}

function BackLink() {
  return (
    <Link
      to="/events"
      className="text-pink-400 hover:text-pink-300 inline-flex items-center gap-1 mb-4 text-sm"
    >
      <ArrowLeft size={16} /> Back to events
    </Link>
  );
}

function AddSessionForm({ eventId, onAdded }) {
  const empty = {
    SessionTitle: "",
    SessionDescription: "",
    SessionType: SESSION_TYPES[0],
    StartTime: "",
    EndTime: "",
  };

  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async () => {
    setError("");
    setSuccess("");
    setBusy(true);

    try {
      await addSession(eventId, form);
      setForm(empty);
      setSuccess("Session added");
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-card ring-1 ring-edge rounded-xl p-4 mb-4">
      <h3 className="font-medium text-white mb-3 inline-flex items-center gap-2">
        <Plus size={16} className="text-pink-400" /> Add session
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Session title</label>
          <input
            className={inputCls}
            value={form.SessionTitle}
            onChange={set("SessionTitle")}
          />
        </div>

        <div>
          <label className={labelCls}>Session type</label>
          <select
            className={inputCls}
            value={form.SessionType}
            onChange={set("SessionType")}
          >
            {SESSION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Description</label>
          <input
            className={inputCls}
            value={form.SessionDescription}
            onChange={set("SessionDescription")}
          />
        </div>

        <div>
          <label className={labelCls}>Start time</label>
          <input
            type="datetime-local"
            className={inputCls}
            value={form.StartTime}
            onChange={set("StartTime")}
          />
        </div>

        <div>
          <label className={labelCls}>End time</label>
          <input
            type="datetime-local"
            className={inputCls}
            value={form.EndTime}
            onChange={set("EndTime")}
          />
        </div>
      </div>

      {error && <p className="text-red-300 text-sm mt-3">{error}</p>}
      {success && (
        <p className="text-emerald-300 text-sm mt-3">{success}</p>
      )}

      <button
        onClick={submit}
        disabled={busy}
        className="mt-3 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-sm font-medium disabled:opacity-50"
      >
        {busy ? "Adding..." : "Add session"}
      </button>
    </div>
  );
}

function AddTicketForm({ eventId, onAdded }) {
  const empty = { TicketType: "", Price: "", Quantity: "" };

  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async () => {
    setError("");
    setSuccess("");
    setBusy(true);

    try {
      await addTicket(eventId, form);
      setForm(empty);
      setSuccess("Ticket type added");
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-card ring-1 ring-edge rounded-xl p-4 mb-4">
      <h3 className="font-medium text-white mb-3 inline-flex items-center gap-2">
        <Plus size={16} className="text-pink-400" /> Add ticket type
      </h3>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelCls}>Ticket type</label>
          <input
            className={inputCls}
            placeholder="e.g. General"
            value={form.TicketType}
            onChange={set("TicketType")}
          />
        </div>

        <div>
          <label className={labelCls}>Price (₹)</label>
          <input
            type="number"
            min="1"
            className={inputCls}
            value={form.Price}
            onChange={set("Price")}
          />
        </div>

        <div>
          <label className={labelCls}>Quantity</label>
          <input
            type="number"
            min="1"
            className={inputCls}
            value={form.Quantity}
            onChange={set("Quantity")}
          />
        </div>
      </div>

      {error && <p className="text-red-300 text-sm mt-3">{error}</p>}
      {success && (
        <p className="text-emerald-300 text-sm mt-3">{success}</p>
      )}

      <button
        onClick={submit}
        disabled={busy}
        className="mt-3 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-sm font-medium disabled:opacity-50"
      >
        {busy ? "Adding..." : "Add ticket type"}
      </button>
    </div>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const eventId = Number(id);
  const { user } = useAuth();
  const isOrganizer = user && user.role === "Organizer";

  const [tab, setTab] = useState("Sessions");
  const [data, setData] = useState({
    event: null,
    sessions: [],
    tickets: [],
    feedback: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [cancelError, setCancelError] = useState("");

  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;

    if (reloadKey === 0) setLoading(true);
    setError("");

    async function loadEvent() {
      try {
        // Feedback is optional because its backend endpoint
        // has not been implemented yet.
        const [event, sessions, tickets] = await Promise.all([
          getEvent(eventId),
          getSessions(eventId),
          getTickets(eventId),
        ]);

        let feedback = [];

        try {
          feedback = await getEventFeedback(eventId);
        } catch (feedbackError) {
          console.warn(
            "Feedback is currently unavailable:",
            feedbackError.message
          );
        }

        if (!cancelled) {
          setData({ event, sessions, tickets, feedback });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, [eventId, reloadKey]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this event? This cannot be undone.")) {
      return;
    }

    setCancelError("");

    try {
      await cancelEvent(eventId);
      reload();
    } catch (err) {
      setCancelError(err.message);
    }
  };

  if (loading) {
    return (
      <div>
        <BackLink />
        <p className="text-gray-500">Loading event...</p>
      </div>
    );
  }

  if (error || !data.event) {
    return (
      <div>
        <BackLink />
        <p className="text-red-300">
          {error || "Event does not exist"}
        </p>
      </div>
    );
  }

  const { event, sessions, tickets, feedback } = data;

  const canEdit =
    isOrganizer &&
    event.EventStatus !== "Cancelled" &&
    event.EventStatus !== "Completed";

  const canCancel = canEdit;

  return (
    <div>
      <BackLink />

      <div className="bg-card ring-1 ring-edge rounded-xl p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {event.EventTitle}
            </h1>
            <p className="text-gray-400 mt-1">
              {event.EventDescription}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={event.EventStatus} />

            {canCancel && (
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-300 ring-1 ring-red-400/40 hover:bg-red-500/10"
              >
                <Ban size={14} /> Cancel event
              </button>
            )}
          </div>
        </div>

        {cancelError && (
          <p className="text-red-300 text-sm mt-3">{cancelError}</p>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={16} className="text-pink-400" />
            {fmtDate(event.StartDate)} to {fmtDate(event.EndDate)}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Users size={16} className="text-pink-400" />
            Capacity {event.Capacity ?? "Not available"}
          </span>

          <span>Category: {event.EventCategory ?? "Not specified"}</span>
          <span>Venue ID: {event.VenueID}</span>
        </div>
      </div>

      <div className="flex gap-1 border-b border-edge mb-5">
        {["Sessions", "Tickets", "Feedback"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition ${
              tab === t
                ? "border-pink-500 text-pink-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Sessions" && (
        <div>
          {canEdit && (
            <AddSessionForm eventId={eventId} onAdded={reload} />
          )}

          <div className="grid gap-3">
            {sessions.length === 0 && (
              <p className="text-gray-500">No sessions added yet.</p>
            )}

            {sessions.map((s) => (
              <div
                key={s.SessionID}
                className="bg-card ring-1 ring-edge rounded-xl p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium text-white">
                    {s.SessionTitle}
                  </h3>

                  <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300">
                    {s.SessionType ?? "Session"}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mt-1">
                  {s.SessionDescription ?? ""}
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  {fmt(s.StartTime)} to {fmt(s.EndTime)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Tickets" && (
        <div>
          {canEdit && (
            <AddTicketForm eventId={eventId} onAdded={reload} />
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {tickets.length === 0 && (
              <p className="text-gray-500">
                No tickets for this event.
              </p>
            )}

            {tickets.map((t) => {
              const remaining = Number(t.QuantityAvailable ?? 0);
              const sold = Number(t.QuantitySold ?? 0);
              const total = sold + remaining;
              const pct =
                total > 0
                  ? Math.min(100, Math.round((sold / total) * 100))
                  : 0;
              const soldOut = remaining <= 0;

              return (
                <div
                  key={t.TicketID}
                  className="bg-card ring-1 ring-edge rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">
                      {t.TicketType}
                    </h3>

                    <span className="text-pink-400 font-semibold">
                      ₹{Number(t.Price).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-edge mt-3 overflow-hidden">
                    <div
                      className={`h-full ${
                        soldOut ? "bg-red-500" : "bg-pink-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>
                      {sold} of {total} sold
                    </span>

                    <span className={soldOut ? "text-red-400" : ""}>
                      {soldOut
                        ? "Sold out"
                        : `${remaining} remaining`}
                    </span>
                  </div>

                  {!isOrganizer && (
                    <Link
                      to="/registrations"
                      className="inline-block mt-3 text-sm text-pink-400 hover:text-pink-300"
                    >
                      Go to registration →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "Feedback" && (
        <div className="grid gap-4">
          {sessions.length === 0 && (
            <p className="text-gray-500">
              No sessions, so no feedback yet.
            </p>
          )}

          {sessions.map((s) => {
            const list = feedback.filter(
              (f) => Number(f.SessionID) === Number(s.SessionID)
            );

            const avg = list.length
              ? list.reduce((sum, f) => sum + Number(f.Rating), 0) /
                list.length
              : 0;

            return (
              <div
                key={s.SessionID}
                className="bg-card ring-1 ring-edge rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">
                    {s.SessionTitle}
                  </h3>

                  {list.length > 0 && (
                    <span className="text-sm text-gray-400 inline-flex items-center gap-2">
                      <Stars value={Math.round(avg)} />
                      {avg.toFixed(1)} ({list.length})
                    </span>
                  )}
                </div>

                {list.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Feedback is unavailable or has not been submitted.
                  </p>
                )}

                {list.map((f) => (
                  <div
                    key={f.FeedbackID}
                    className="border-t border-edge py-2 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <Stars value={Number(f.Rating)} />
                      <span className="text-xs text-gray-500">
                        {fmtDate(f.FeedbackDate)}
                      </span>
                    </div>

                    <p className="text-gray-300 mt-1">
                      {f.Comments}
                    </p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
