const API_URL = import.meta.env.VITE_API_URL || "/api";

export function roleNormalise(role) {
  return String(role || "").toUpperCase();
}

export function estAdmin(user) {
  return roleNormalise(user?.role) === "ADMIN";
}

export function estEmploye(user) {
  const role = roleNormalise(user?.role);
  return role === "EMPLOYEE" || role === "EMPLOYE";
}

export function lireSession() {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function lireToken() {
  return sessionStorage.getItem("token") || "";
}

export function enregistrerSession({ token, user, role, email }) {
  if (token) {
    sessionStorage.setItem("token", token);
  }

  const profil = user || { role, email };
  sessionStorage.setItem("user", JSON.stringify(profil));
  window.dispatchEvent(new Event("auth-change"));
}

export function viderSession() {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  window.dispatchEvent(new Event("auth-change"));
}

export function destinationApresLogin(user) {
  if (estAdmin(user)) return "/admin";
  if (estEmploye(user)) return "/employe";
  return "/";
}

export function enTetesAuth(token = lireToken()) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export { API_URL };
