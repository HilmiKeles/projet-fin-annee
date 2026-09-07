import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/Newsletter.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterDesinscription() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const [chargement, setChargement] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErreur("");

    if (!EMAIL_REGEX.test(email.trim())) {
      setErreur("Indiquez l'adresse e-mail à désinscrire.");
      return;
    }

    setChargement(true);

    try {
      const reponse = await fetch(`${API_URL}/newsletter/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await reponse.json().catch(() => ({}));

      if (!reponse.ok) {
        throw new Error(data.error || "Désinscription impossible pour le moment.");
      }

      setSucces(true);
    } catch (err) {
      setErreur(err.message || "Une erreur est survenue. Réessayez.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="nl-page">
      <section className="nl-hero">
        <p className="nl-kicker">Préférences e-mail</p>
        <h1>Se désinscrire de la newsletter</h1>
        <p>
          Saisissez l'adresse utilisée lors de l'inscription. Vous pourrez vous
          réabonner plus tard depuis la page newsletter.
        </p>
      </section>

      <section className="nl-inscription">
        <div className="nl-inscription-card">
          {succes ? (
            <div className="nl-form-succes" role="status">
              <h2>C'est noté</h2>
              <p>
                Cette adresse ne recevra plus la newsletter Thé Tip Top.
                Les messages liés au jeu-concours (gain, retrait en boutique)
                ne sont pas concernés.
              </p>
              <Link to="/newsletter" className="btn-primary">
                Retour à la newsletter
              </Link>
            </div>
          ) : (
            <>
              <h2>Adresse à retirer</h2>
              <form className="nl-form" onSubmit={handleSubmit} noValidate>
                <div className="nl-form-ligne">
                  <label className="sr-only" htmlFor="newsletter-unsub-email">
                    Adresse e-mail
                  </label>
                  <input
                    id="newsletter-unsub-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Votre adresse e-mail"
                    autoComplete="email"
                    required
                  />
                  <button type="submit" disabled={chargement}>
                    {chargement ? "Traitement..." : "Me désinscrire"}
                  </button>
                </div>
                {erreur && (
                  <p className="nl-form-erreur" role="alert">
                    {erreur}
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
