
const API_BASE_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

function mapEvent(e) {
  return {
    ...e,
    EventID: Number(e.EventID),
    EventTitle: e.EventTitle,
    EventDescription: e.EventDescription || "",
    VenueID: Number(e.VenueID),
    OrganizerID: Number(e.OrganizerID),
    StartDate: e.StartDate,
    EndDate: e.EndDate,
    EventStatus:
      e.EventStatus?.charAt(0) +
      e.EventStatus?.slice(1).toLowerCase(),
  };
}

export async function getEvents() {
  const data = await request("/events");
  return data.map(mapEvent);
}

export async function getEvent(eventId) {
  const data = await request(`/events/${Number(eventId)}`);
  return mapEvent(data);
}

// These operations need backend endpoints before they can work.
export async function createEvent() {
  throw new Error("Event creation API has not been implemented yet.");
}

export async function cancelEvent() {
  throw new Error("Event cancellation API has not been implemented yet.");
}
