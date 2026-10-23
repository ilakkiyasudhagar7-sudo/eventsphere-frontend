
const API_BASE_URL = "http://localhost:5000/api";

export async function getVenues() {
  const response = await fetch(`${API_BASE_URL}/venues`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch venues");
  }

  return data.map((v) => ({
    ...v,
    VenueID: Number(v.VenueID),
    Capacity: Number(v.Capacity),
  }));
}

export async function addVenue() {
  throw new Error("Venue creation API has not been implemented yet.");
}
