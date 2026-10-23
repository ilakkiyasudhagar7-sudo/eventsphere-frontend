
const API_BASE_URL = "http://localhost:5000/api";

function getToken() {
  // Read the token saved after login
  return localStorage.getItem("token");
}

async function request(endpoint, method = "GET", body = null) {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function registerForTicket(ticketId) {
  return request("/registrations", "POST", {
    TicketID: ticketId,
  });
}

export async function processPayment(registrationId) {
  return request("/payments", "POST", {
    RegistrationID: registrationId,
  });
}

export async function getMyRegistrations() {
  return request("/registrations/me");
}

export async function getAllPayments() {
  throw new Error("All-payments API is not implemented yet.");
}
