import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

// URL de l'API : utilise la variable d'env Vite au build,
// sinon fallback sur /api (proxyfié par nginx vers le backend)
const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function Connexion() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      // 1. Appel à l'API backend (via le proxy nginx /api en production)
      const reponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: motDePasse,
        }),
      });

      const data = await reponse.json();

      // 2. Si le mot de passe est faux ou l'utilisateur n'existe pas
      if (!reponse.ok) {
        throw new Error(data.message || "Identifiants incorrects");
      }

      // 3. On sauvegarde les données de l'utilisateur et le token JWT
      sessionStorage.setItem(
        "user",
        JSON.stringify(data.utilisateur || data.user || data),
      );
      if (data.token) {
        sessionStorage.setItem("token", data.token);
      }

      // 4. Redirection vers la page profil
      navigate("/profil");
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