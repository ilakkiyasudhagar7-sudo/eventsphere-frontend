// src/pages/Connections.jsx
import { useEffect, useState } from "react";
import { Check, X, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getMyConnections,
  getAttendeeDirectory,
  sendRequest,
  respondToRequest,
} from "../api/connections";

const fmtDate = (d) => {
  const date = new Date(d);
  return isNaN(date) ? String(d) : date.toLocaleDateString("en-IN", { dateStyle: "medium" });
};

const pillCls = {
  Pending: "bg-pink-500/15 text-pink-300",
  Accepted: "bg-emerald-500/15 text-emerald-300",
  Rejected: "bg-red-500/15 text-red-300",
};

function Pill({ status }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${pillCls[status] || "bg-white/10 text-gray-300"}`}>
      {status}
    </span>
  );
}

function PersonRow({ p, note, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-edge last:border-0">
      <div>
        <p className="text-white font-medium">{p ? p.FullName : "Unknown"}</p>
        <p className="text-xs text-gray-400">
          {p ? `${p.Profession} at ${p.Organisation}, ${p.City}` : ""}
        </p>
        {note && <p className="text-xs text-gray-500 mt-0.5">{note}</p>}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function Section({ title, count, children, empty }) {
  return (
    <div className="bg-card ring-1 ring-edge rounded-xl p-5">
      <h2 className="text-white font-semibold mb-2">
        {title} <span className="text-gray-500 font-normal text-sm">({count})</span>
      </h2>
      {count === 0 ? <p className="text-sm text-gray-500 py-2">{empty}</p> : children}
    </div>
  );
}

export default function Connections() {
  const { user } = useAuth();
  const me = user.AttendeeID;

  const [connections, setConnections] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [msg, setMsg] = useState(null); // { type: "ok" | "error", text }

  const load = async () => {
    const [c, d] = await Promise.all([getMyConnections(), getAttendeeDirectory()]);
    setConnections(c);
    setDirectory(d);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const run = async (key, fn, okText) => {
    setBusy(key);
    setMsg(null);
    try {
      await fn();
      setMsg({ type: "ok", text: okText });
      await load();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setBusy(null);
    }
  };

  const incoming = connections.filter(
    (c) => c.ReceiverAttendeeID === me && c.ConnectionStatus === "Pending"
  );
  const sent = connections.filter((c) => c.RequesterAttendeeID === me);
  const accepted = connections.filter((c) => c.ConnectionStatus === "Accepted");
  const connectedIds = new Set(
    connections.map((c) => (c.RequesterAttendeeID === me ? c.ReceiverAttendeeID : c.RequesterAttendeeID))
  );
  const suggestions = directory.filter((p) => !connectedIds.has(p.AttendeeID));

  const btn = "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 transition";

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Connections</h1>

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

      {loading ? (
        <p className="text-gray-500">Loading connections...</p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <Section title="Incoming requests" count={incoming.length} empty="No pending requests.">
            {incoming.map((c) => (
              <PersonRow key={c.ConnectionID} p={c.Requester} note={`Requested ${fmtDate(c.RequestedAt)}`}>
                <button
                  disabled={busy === c.ConnectionID}
                  onClick={() => run(c.ConnectionID, () => respondToRequest(c.ConnectionID, "Accepted"), "Request accepted")}
                  className={`${btn} bg-pink-600 hover:bg-pink-500 text-white`}
                >
                  <Check size={14} /> Accept
                </button>
                <button
                  disabled={busy === c.ConnectionID}
                  onClick={() => run(c.ConnectionID, () => respondToRequest(c.ConnectionID, "Rejected"), "Request rejected")}
                  className={`${btn} ring-1 ring-edge text-gray-300 hover:bg-white/5`}
                >
                  <X size={14} /> Reject
                </button>
              </PersonRow>
            ))}
          </Section>

          <Section title="My connections" count={accepted.length} empty="No connections yet.">
            {accepted.map((c) => {
              const other = c.RequesterAttendeeID === me ? c.Receiver : c.Requester;
              return (
                <PersonRow key={c.ConnectionID} p={other} note={`Connected ${fmtDate(c.RespondedAt)}`}>
                  <Pill status="Accepted" />
                </PersonRow>
              );
            })}
          </Section>

          <Section title="Sent requests" count={sent.length} empty="You haven't sent any requests.">
            {sent.map((c) => (
              <PersonRow key={c.ConnectionID} p={c.Receiver} note={`Sent ${fmtDate(c.RequestedAt)}`}>
                <Pill status={c.ConnectionStatus} />
              </PersonRow>
            ))}
          </Section>

          <Section title="People you may know" count={suggestions.length} empty="You're connected with everyone.">
            {suggestions.map((p) => (
              <PersonRow key={p.AttendeeID} p={p}>
                <button
                  disabled={busy === "send-" + p.AttendeeID}
                  onClick={() => run("send-" + p.AttendeeID, () => sendRequest(p.AttendeeID), `Request sent to ${p.FullName}`)}
                  className={`${btn} ring-1 ring-pink-500/50 text-pink-300 hover:bg-pink-500/10`}
                >
                  <UserPlus size={14} /> Connect
                </button>
              </PersonRow>
            ))}
          </Section>
        </div>
      )}
    </div>
  );
}