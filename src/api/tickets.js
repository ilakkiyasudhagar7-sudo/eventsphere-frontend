
const API_BASE_URL = "http://localhost:5000/api";

export async function getTickets(eventId) {
  const response = await fetch(
    `${API_BASE_URL}/events/${Number(eventId)}/tickets`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch tickets");
  }

  return data.map((t) => ({
    ...t,
    TicketID: Number(t.TicketID),
    EventID: Number(t.EventID),
    Price: Number(t.Price),
    QuantityAvailable: Number(t.QuantityAvailable),
  }));
}

export async function addTicket() {
  throw new Error("Ticket creation API has not been implemented yet.");
}
