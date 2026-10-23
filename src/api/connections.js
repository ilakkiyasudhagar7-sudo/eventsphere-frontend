
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

export async function getAttendeeDirectory() {
  return request("/attendees");
}

export async function getMyConnections() {
  throw new Error("Connections API has not been implemented in the backend yet.");
}

export async function sendRequest() {
  throw new Error("Sending connection requests is not implemented yet.");
}

export async function respondToRequest() {
  throw new Error("Responding to connection requests is not implemented yet.");
}
