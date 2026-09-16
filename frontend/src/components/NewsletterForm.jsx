import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Newsletter.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm({ variante = "page" }) {
  const [email, setEmail] = useState("");
  const [consentement, setConsentement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const [chargement, setChargement] = useState(false);

  const sombre = variante === "sombre";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErreur("");

    if (!EMAIL_REGEX.test(email.trim())) {
      setErreur("Indiquez une adresse e-mail valide.");
      return;
    }

    if (!consentement) {
      setErreur("Cochez la case pour accepter de recevoir la newsletter.");
      return;
    }

    setChargement(true);

    try {
      const reponse = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          consent: true,
        }),
      });

      const data = await reponse.json().catch(() => ({}));

      if (!reponse.ok) {
        throw new Error(data.error || "Inscription impossible pour le moment.");
      }

      setSucces(true);
      setEmail("");
      setConsentement(false);
    } catch (err) {
      setErreur(err.message || "Une erreur est survenue. Réessayez.");
    } finally {
      setChargement(false);
    }
  };

  if (succes) {
    return (
      <div className={`nl-form-succes ${sombre ? "nl-form-succes-sombre" : ""}`} role="status">
        <p>
          Merci ! Votre inscription est enregistrée. Vous recevrez bientôt
          nos actualités, recettes et infos du jeu-concours.
        </p>
        <button
          type="button"
          className={sombre ? "nl-form-lien-sombre" : "nl-form-lien"}
          onClick={() => setSucces(false)}
        >
          Inscrire une autre adresse
        </button>
      </div>
    );
  }

  return (
    <form className={`nl-form ${sombre ? "nl-form-sombre" : ""}`} onSubmit={handleSubmit} noValidate>
      <div className="nl-form-ligne">
        <label className="sr-only" htmlFor={`newsletter-email-${variante}`}>
          Adresse e-mail
        </label>
        <input
          id={`newsletter-email-${variante}`}
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Votre adresse e-mail"
          autoComplete="email"
          required
        />
        <button type="submit" disabled={chargement}>
          {chargement ? "Inscription..." : "Je m'abonne"}
        </button>
      </div>

      <label className="nl-form-consent">
        <input
          type="checkbox"
          name="consentement"
          checked={consentement}
          onChange={(event) => setConsentement(event.target.checked)}
        />
        <span>
          J'accepte de recevoir la newsletter Thé Tip Top et j'ai lu la{" "}
          <Link to="/confidentialite">politique de confidentialité</Link>.
        </span>
      </label>

      {erreur && (
        <p className="nl-form-erreur" role="alert">
          {erreur}
        </p>
      )}
    </form>
  );
}
