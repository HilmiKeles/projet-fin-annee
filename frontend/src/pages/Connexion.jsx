import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

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
      // TODO : remplacer par l'appel à votre API
      // const reponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, motDePasse }),
      // });
      // const data = await reponse.json();
      // if (!reponse.ok) throw new Error(data.message || "Identifiants incorrects");

      // Simulation en attendant l'API
      const utilisateur = {
        prenom: "Théophile",
        email: email,
      };

      sessionStorage.setItem("user", JSON.stringify(utilisateur));
      navigate("/mon-compte");
    } catch (err) {
      setErreur(err.message || "Une erreur est survenue, veuillez réessayer.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <main className="auth">
      <section className="auth-card">
        <div className="auth-emoji" aria-hidden="true">🍃</div>
        <h1>Connexion</h1>
        <p className="auth-intro">
          Connectez-vous pour saisir votre code de participation
          et découvrir votre lot.
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

          <button type="submit" className="btn-primary auth-bouton" disabled={chargement}>
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