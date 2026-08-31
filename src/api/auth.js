const loginUrl = `${import.meta.env.VITE_API_URL}/api/auth/login`;
const meUrl = `${import.meta.env.VITE_API_URL}/api/auth/me`;
const logoutUrl = `${import.meta.env.VITE_API_URL}/api/auth/logout`;
const registerURL = `${import.meta.env.VITE_API_URL}/api/auth/register`;

export const loginUser = async function (email, password) {
  const response = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
};

export async function getMe() {
  const response = await fetch(meUrl, {
    credentials: "include",
  });
  if (!response.ok) return null;
  return response.json();
}

export const getCurrentUser = getMe;

export async function logoutUser() {
  const response = await fetch(logoutUrl, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Logout failed");
  return response.json();
}

export async function registerUser(name, email, password) {
  const response = await fetch(registerURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Registration failed");
  return data;
}
