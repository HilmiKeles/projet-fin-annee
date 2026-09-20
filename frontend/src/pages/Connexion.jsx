import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { destinationApresLogin, enregistrerSession } from "../utils/auth";
import GoogleButton from "../components/GoogleButton.jsx";
import "../styles/Auth.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Connexion() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const handleGoogleResponse = async (response) => {
    setErreur("");
    try {
      const reponse = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        throw new Error(data.error || "Connexion Google échouée");
      }

      if (data.token) {
        const utilisateur = data.user || data.utilisateur || { role: data.role };
        enregistrerSession({
          token: data.token,
          user: utilisateur,
          role: data.role,
        });
        navigate(destinationApresLogin(utilisateur));
        return;
      }
      navigate("/");
    } catch (err) {
      setErreur(err.message || "Erreur lors de la connexion Google.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      const reponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: motDePasse,
        }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        throw new Error(data.error || data.message || "Identifiants incorrects");
      }

      const utilisateur = data.utilisateur || data.user || { role: data.role };
      enregistrerSession({
        token: data.token,
        user: utilisateur,
        role: data.role,
        email,
      });
      navigate(destinationApresLogin(utilisateur));
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
        <h1>Connexion</h1>
        <p className="auth-intro">
          Connectez-vous pour saisir votre code de participation et découvrir
          votre lot.
        </p>

        {erreur && (
          <div className="auth-erreur" role="alert">
            {erreur}
          </div>
        )}

        {GOOGLE_CLIENT_ID && (
          <>
            <GoogleButton onSuccess={handleGoogleResponse} text="signin_with" />
            <div className="auth-separateur">
              <span>ou</span>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} noValidate>
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
          <div className="form-groupe">
            <label htmlFor="motdepasse">Mot de passe</label>
            <input
              type="password"
              id="motdepasse"
              name="motDePasse"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="Votre mot de passe"
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-bouton"
            disabled={chargement}
          >
            {chargement ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <p className="auth-lien">
          Pas encore de compte ?{" "}
          <Link to="/inscription">Créez votre compte gratuitement</Link>
        </p>
      </section>
    </main>
  );
}