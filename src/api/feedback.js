
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

export async function getEventFeedback(eventId) {
  return request(`/events/${Number(eventId)}/feedback`);
}

export async function getMySessions() {
  throw new Error("My sessions API has not been implemented in the backend yet.");
}

export async function getAllFeedback() {
  throw new Error("Fetching all feedback is not implemented yet.");
}

export async function submitFeedback(sessionId, data) {
  throw new Error("Submitting feedback is not implemented in the backend yet.");
}
