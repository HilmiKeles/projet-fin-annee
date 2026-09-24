import { useState } from "react";
import { Link } from "react-router-dom";
import Honeypot from "../components/Honeypot.jsx";
import { MESSAGE_ROBOT, estRobot } from "../utils/honeypot";
import "../styles/Auth.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(false);
  const [piegeRobot, setPiegeRobot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setMessage("");

    if (estRobot(piegeRobot)) {
      setErreur(MESSAGE_ROBOT);
      return;
    }

    setChargement(true);

    try {
      const reponse = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        throw new Error(
          data.error || data.message || "Impossible d'envoyer la demande.",
        );
      }

      setMessage(
        data.message ||
          "Si un compte existe pour cette adresse, un e-mail de réinitialisation vient d'être envoyé.",
      );
    } catch (err) {
      setErreur(err.message || "Une erreur est survenue, veuillez réessayer.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <main className="auth">
      <section className="auth-card">
        <div className="auth-emoji" aria-hidden="true">
          🍃
        </div>
        <h1>Mot de passe oublié</h1>
        <p className="auth-intro">
          Indiquez l&apos;adresse e-mail de votre compte. Si elle est reconnue,
          vous recevrez un e-mail pour choisir un nouveau mot de passe. Ce lien
          expire dans une heure.
        </p>

        {erreur && (
          <div className="auth-erreur" role="alert">
            {erreur}
          </div>
        )}

        {message && (
          <div className="auth-succes" role="status">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Honeypot
            idSuffixe="oubli"
            checked={piegeRobot}
            onChange={(e) => setPiegeRobot(e.target.checked)}
          />

          <div className="form-groupe">
            <label htmlFor="email">Adresse e-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              placeholder="exemple@email.fr"
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-bouton"
            disabled={chargement}
          >
            {chargement ? "Envoi en cours..." : "Envoyer l'e-mail"}
          </button>
        </form>

        <p className="auth-lien">
          <Link to="/connexion">Retour à la connexion</Link>
        </p>
      </section>
    </main>
  );
}
