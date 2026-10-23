
const API_BASE_URL = "http://localhost:5000/api";

const SESSION_TYPES = ["Keynote", "Talk", "Workshop", "Panel", "Networking"];
export { SESSION_TYPES };

export async function getSessions(eventId) {
  const response = await fetch(
    `${API_BASE_URL}/events/${Number(eventId)}/sessions`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch sessions");
  }

  return data.map((s) => ({
    ...s,
    SessionID: Number(s.SessionID),
    EventID: Number(s.EventID),
  }));
}

export async function addSession() {
  throw new Error("Session creation API has not been implemented yet.");
}
