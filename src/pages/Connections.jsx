// src/pages/Connections.jsx
import { useState } from "react";
import { Users, UserCheck, UserPlus, Search, Sparkles, Check } from "lucide-react";

const mockConnectionsData = {
  myConnections: [
    { ConnectionID: "c1", Name: "Judith Igdaliah Ebenezar", Email: "judith@example.com", Role: "Organizer" },
    { ConnectionID: "c2", Name: "Preeti B R", Email: "preeti@example.com", Role: "Attendee" }
  ],
  incomingRequests: [
    { ConnectionID: "c3", Name: "Rahul Sharma", Email: "rahul@example.com", Role: "Attendee" }
  ],
  recommendations: [
    { AttendeeID: "a5", Name: "Ananya Iyer", Email: "ananya@example.com", MutualConnections: 2 },
    { AttendeeID: "a6", Name: "Karthik Raja", Email: "karthik@example.com", MutualConnections: 3 }
  ]
};

export default function Connections() {
  const [activeTab, setActiveTab] = useState("my-connections");
  const [search, setSearch] = useState("");
  const [data, setData] = useState(mockConnectionsData);

  const handleAccept = (connId) => {
    setData((prev) => {
      const conn = prev.incomingRequests.find((r) => r.ConnectionID === connId);
      return {
        ...prev,
        incomingRequests: prev.incomingRequests.filter((r) => r.ConnectionID !== connId),
        myConnections: conn ? [...prev.myConnections, conn] : prev.myConnections
      };
    });
  };

  const handleConnect = (attendeeId) => {
    setData((prev) => ({
      ...prev,
      recommendations: prev.recommendations.filter((r) => r.AttendeeID !== attendeeId)
    }));
  };

  const filteredConnections = data.myConnections.filter((c) =>
    c.Name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Networking & Connections</h1>
          <p className="text-sm text-gray-400">Connect with attendees and organizers</p>
        </div>

        <div className="flex items-center gap-2 bg-card ring-1 ring-edge p-1 rounded-xl text-sm">
          <button
            onClick={() => setActiveTab("my-connections")}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              activeTab === "my-connections" ? "bg-pink-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            My Connections ({data.myConnections.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              activeTab === "requests" ? "bg-pink-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Requests ({data.incomingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              activeTab === "discover" ? "bg-pink-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Sparkles size={14} /> Discover
          </button>
        </div>
      </div>

      {activeTab === "my-connections" && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search connections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl ring-1 ring-edge bg-card text-sm text-gray-100 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredConnections.map((c) => (
              <div key={c.ConnectionID} className="bg-card ring-1 ring-edge rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-600/20 text-pink-300 ring-1 ring-pink-500/30 flex items-center justify-center font-semibold text-sm">
                    {c.Name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{c.Name}</h3>
                    <p className="text-xs text-gray-400">{c.Email}</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 flex items-center gap-1">
                  <UserCheck size={12} /> Connected
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "requests" && (
        <div className="grid gap-4 md:grid-cols-2">
          {data.incomingRequests.map((r) => (
            <div key={r.ConnectionID} className="bg-card ring-1 ring-edge rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30 flex items-center justify-center font-semibold text-sm">
                  {r.Name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">{r.Name}</h3>
                  <p className="text-xs text-gray-400">Connection Request</p>
                </div>
              </div>
              <button
                onClick={() => handleAccept(r.ConnectionID)}
                className="p-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white transition"
              >
                <Check size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "discover" && (
        <div className="grid gap-4 md:grid-cols-2">
          {data.recommendations.map((rec) => (
            <div key={rec.AttendeeID} className="bg-card ring-1 ring-edge rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 text-purple-300 ring-1 ring-purple-500/30 flex items-center justify-center font-semibold text-sm">
                  {rec.Name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">{rec.Name}</h3>
                  <p className="text-xs text-gray-400">{rec.MutualConnections} mutual connections</p>
                </div>
              </div>
              <button
                onClick={() => handleConnect(rec.AttendeeID)}
                className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-medium transition flex items-center gap-1"
              >
                <UserPlus size={14} /> Connect
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}