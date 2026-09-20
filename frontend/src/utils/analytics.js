import { API_URL } from "./auth";

export const GA4_MEASUREMENT_ID = "G-VED2LCK279";
export const GA4_URL = "https://analytics.google.com/analytics/web/";

const CLE_CONSENTEMENT = "thetiptop_cookie_consent";

export function analyticsAutorisees() {
  try {
    const brut = localStorage.getItem(CLE_CONSENTEMENT);
    if (!brut) return false;
    return Boolean(JSON.parse(brut).analytics);
  } catch {
    return false;
  }
}

export function envoyerEvenementGa(nom, params = {}) {
  if (!analyticsAutorisees() || typeof window.gtag !== "function") return;
  window.gtag("event", nom, params);
}

export function suivreCta(name) {
  envoyerEvenementGa("cta_click", { cta_id: name });
  fetch(`${API_URL}/analytics/cta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  }).catch(() => {});
}

export function suivreConversion(gain) {
  envoyerEvenementGa("conversion", {
    event_category: "jeu",
    event_label: String(gain || "lot"),
  });
}
