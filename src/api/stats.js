
const API_BASE_URL = "http://localhost:5000/api";

export async function getOverview() {
  const response = await fetch(`${API_BASE_URL}/stats/overview`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch statistics");
  }

  return data;
}
