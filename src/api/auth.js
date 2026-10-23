
const API_BASE_URL = "http://localhost:5000/api";

async function apiRequest(endpoint, body) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}

function formatSession(user) {
  return {
    ...user,
    role:
      user.role?.toUpperCase() === "ORGANIZER"
        ? "Organizer"
        : "Attendee",
  };
}

export async function login(email, password) {
  const user = await apiRequest("/auth/login", {
    Email: email.trim(),
    Password: password,
  });

  if (user.token) {
    localStorage.setItem("token", user.token);
  }

  return formatSession(user);
}

export async function registerUser(data) {
  const user = await apiRequest("/auth/register", {
    FullName: data.FullName.trim(),
    Email: data.Email.trim(),
    Password: data.Password,
    PhoneNumber: data.PhoneNumber || "",
    role: data.role?.toUpperCase() || "ATTENDEE",
    Organisation: data.Organisation || "",
  });

  if (user.token) {
    localStorage.setItem("token", user.token);
  }

  return formatSession(user);
}
