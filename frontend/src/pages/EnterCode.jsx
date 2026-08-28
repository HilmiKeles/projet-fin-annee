import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EnterCode.css";

// URL de l'API (cohérent avec tes autres composants)
const API_URL = import.meta.env.VITE_API_URL || "/api";

// Expression régulière pour valider le format du code (10 caractères alphanumériques)
const CODE_REGEX = /^[A-Z0-9]{10}$/;

export default function EnterCode() {
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  // Formate le code en majuscules et retire les espaces
  function handleChange(e) {
    const valeur = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 10);
    setCode(valeur);
    setErreur("");
  }
  async function handleSubmit(e) {
    e.preventDefault();

    if (!CODE_REGEX.test(code)) {
      setErreur(
        "Le code doit contenir exactement 10 caractères (lettres et chiffres).",
      );
      return;
    }

    // 1. On vérifie que l'utilisateur a bien son token avant de déranger le serveur !
    const token = sessionStorage.getItem("token");
    if (!token) {
      setErreur(
        "Vous n'êtes pas connecté. Veuillez vous connecter pour jouer.",
      );
      return;
    }

    setChargement(true);
    setErreur("");

    try {
      const reponse = await fetch(`${API_URL}/tickets/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // On injecte le token récupéré juste au-dessus
        },
        // J'ai retiré 'credentials: "include"' pour éviter tout conflit avec le backend
        body: JSON.stringify({ code }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        setErreur(
          data.error || data.message || "Code invalide ou déjà utilisé.",
        );
      } else {
        navigate("/resultat", { state: { gain: data.gain } });
      }
    } catch {
      setErreur("Erreur de connexion au serveur. Réessayez.");
    } finally {
      setChargement(false);
    }
  }

  return (
    <main className="enter-code">
      <section className="enter-code-card">
        <h1>🎟️ Participez au jeu</h1>
        <p className="enter-code-intro">
          Saisissez le code à <strong>10 caractères</strong> présent sur votre
          ticket de caisse pour découvrir votre gain.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="code">Votre code</label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={handleChange}
            placeholder="Ex : ABC123XYZ9"
            autoComplete="off"
            maxLength={10}
            required
          />
          <span className="compteur">{code.length}/10</span>

          {erreur && (
            <p className="erreur" role="alert">
              {erreur}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={chargement}>
            {chargement ? "Vérification..." : "Valider mon code"}
          </button>
        </form>

        <p className="enter-code-aide">
          Pas encore inscrit ? <a href="/inscription">Créez votre compte</a>{" "}
          pour participer.
        </p>
      </section>
    </main>
  );
}
