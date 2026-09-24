import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Honeypot from "../components/Honeypot.jsx";
import { MESSAGE_ROBOT, estRobot } from "../utils/honeypot";
import "../styles/Auth.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function validerMotDePasse(motDePasse) {
  if (!motDePasse || motDePasse.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  if (!/[A-Z]/.test(motDePasse)) {
    return "Le mot de passe doit contenir au moins une majuscule.";
  }
  if (!/[a-z]/.test(motDePasse)) {
    return "Le mot de passe doit contenir au moins une minuscule.";
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]';`~]/.test(motDePasse)) {
    return "Le mot de passe doit contenir au moins un caractère spécial.";
  }
  return "";
}

export default function ReinitialiserMotDePasse() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
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

    const erreurMotDePasse = validerMotDePasse(motDePasse);
    if (erreurMotDePasse) {
      setErreur(erreurMotDePasse);
      return;
    }

    if (motDePasse !== confirmation) {
      setErreur("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setChargement(true);

    try {
      const reponse = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: motDePasse }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        throw new Error(
          data.error || data.message || "Impossible de modifier le mot de passe.",
        );
      }

      setMessage(data.message || "Votre mot de passe a été mis à jour.");
      setMotDePasse("");
      setConfirmation("");
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
        <h1>Nouveau mot de passe</h1>
        <p className="auth-intro">
          Choisissez un mot de passe d&apos;au moins 8 caractères, avec une
          majuscule, une minuscule et un caractère spécial.
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

        {!token && !message && (
          <div className="auth-erreur" role="alert">
            Ce lien est incomplet. Demandez un nouveau lien depuis la page mot
            de passe oublié.
          </div>
        )}

        {token && !message && (
          <form onSubmit={handleSubmit} noValidate>
            <Honeypot
              idSuffixe="reinitialisation"
              checked={piegeRobot}
              onChange={(e) => setPiegeRobot(e.target.checked)}
            />

            <div className="form-groupe">
              <label htmlFor="nouveau-motdepasse">Nouveau mot de passe</label>
              <input
                type="password"
                id="nouveau-motdepasse"
                name="nouveauMotDePasse"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                autoComplete="new-password"
                required
                placeholder="Nouveau mot de passe"
              />
            </div>

            <div className="form-groupe">
              <label htmlFor="confirmation-motdepasse">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmation-motdepasse"
                name="confirmation"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                autoComplete="new-password"
                required
                placeholder="Confirmez le mot de passe"
              />
            </div>

            <button
              type="submit"
              className="btn-primary auth-bouton"
              disabled={chargement}
            >
              {chargement ? "Enregistrement..." : "Enregistrer le mot de passe"}
            </button>
          </form>
        )}

        <p className="auth-lien">
          {message ? (
            <Link to="/connexion">Se connecter</Link>
          ) : (
            <Link to="/mot-de-passe-oublie">Demander un nouveau lien</Link>
          )}
        </p>
      </section>
    </main>
  );
}
