import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Connexion() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const googleBtnRef = useRef(null);

  // Charge le SDK Google Identity Services via <script>
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: 320, // valeur en pixels, pas "100%"
        text: "signin_with",
        locale: "fr",
});
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Réponse Google : envoie le credential au backend
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
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem(
          "user",
          JSON.stringify(data.user || data.utilisateur || { role: data.role }),
        );
      }
      navigate("/profil");
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
        throw new Error(data.message || "Identifiants incorrects");
      }

      sessionStorage.setItem(
        "user",
        JSON.stringify(data.utilisateur || data.user || data),
      );
      if (data.token) {
        sessionStorage.setItem("token", data.token);
      }
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

        {/* Bouton Google (rendu par le SDK dans cette div) */}
        {GOOGLE_CLIENT_ID && (
          <>
            <div ref={googleBtnRef} className="google-btn-container" />
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