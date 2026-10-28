const API_BASE_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error(
      "Cannot reach the server. Please check that the backend is running."
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // response had no JSON body
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }
  return data;
}

function capitalize(value) {
  const s = String(value ?? "");
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

function mapEvent(e) {
  return {
    ...e,
    EventID: Number(e.EventID),
    EventDescription: e.EventDescription || "",
    VenueID: Number(e.VenueID),
    OrganizerID: Number(e.OrganizerID),
    EventStatus: capitalize(e.EventStatus),
  };
}

export async function getEvents() {
  const data = await request("/events");
  return (data || []).map(mapEvent);
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