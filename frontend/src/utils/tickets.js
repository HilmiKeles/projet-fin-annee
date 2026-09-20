import { API_URL, enTetesAuth, lireToken } from "./auth";

export async function validerTicket(code) {
  const token = lireToken();
  if (!token) {
    throw new Error(
      "Vous n'êtes pas connecté. Veuillez vous connecter pour jouer.",
    );
  }

  let reponse;
  try {
    reponse = await fetch(`${API_URL}/tickets/validate`, {
      method: "POST",
      headers: enTetesAuth(token),
      body: JSON.stringify({ code }),
    });
  } catch {
    throw new Error("Erreur de connexion au serveur. Réessayez.");
  }
  const data = await reponse.json().catch(() => ({}));

  if (!reponse.ok) {
    throw new Error(
      data.error || data.message || "Code invalide ou déjà utilisé.",
    );
  }

  return data;
}
