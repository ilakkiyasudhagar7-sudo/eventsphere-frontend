const API_BASE_URL = "http://localhost:5000/api";

function getToken() {
  // Read the token saved after login
  return localStorage.getItem("token");
}

async function request(endpoint, method = "GET", body = null) {
  const token = getToken();

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
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

// Backend reads "ticketId" (camelCase). IDs are sent as strings because
// the Java side parses JSON numbers as doubles ("3.0") and Integer.parseInt fails on that.
export async function registerForTicket(ticketId) {
  return request("/registrations", "POST", {
    ticketId: String(ticketId),
  });
}

export async function processPayment(registrationId) {
  return request("/payments", "POST", {
    RegistrationID: String(registrationId),
  });
}

export async function getMyRegistrations() {
  return request("/registrations/me");
}

export async function getAllPayments() {
  throw new Error("All-payments API is not implemented yet.");
}