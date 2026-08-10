import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setChargement(true);
    setErreur("");

    try {
      const reponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        setErreur(data.message || "Email ou mot de passe incorrect.");
      } else {
        navigate("/mon-compte");
      }
    } catch {
      setErreur("Erreur de connexion au serveur. Réessayez.");
    } finally {
      setChargement(false);
    }
  }

  return (
    <main className="auth">
      <section className="auth-card">
        <h1>🔑 Connexion</h1>
        <p className="auth-intro">
          Connectez-vous pour participer au jeu-concours et suivre vos gains.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Adresse email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="marie.dupont@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          {erreur && <p className="erreur" role="alert">{erreur}</p>}

          <button type="submit" className="btn-primary" disabled={chargement}>
            {chargement ? "Connexion..." : "Me connecter"}
          </button>
        </form>

        <p className="auth-aide">
          Pas encore de compte ? <Link to="/inscription">Inscrivez-vous</Link>
        </p>
      </section>
    </main>
  );
}