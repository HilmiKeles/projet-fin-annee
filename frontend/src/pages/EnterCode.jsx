import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LotoMachine from "../components/LotoMachine.jsx";
import { API_URL, lireToken } from "../utils/auth";
import { CODE_REGEX, normaliserCode } from "../utils/ticketCode.js";
import { dureeAnimationTirage } from "../utils/tirage.js";
import "../styles/EnterCode.css";

function attendre(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function EnterCode() {
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState("");
  const [tirageEnCours, setTirageEnCours] = useState(false);
  const navigate = useNavigate();
  const connecte = Boolean(lireToken());
  const ignoreRef = useRef(false);

  useEffect(() => {
    ignoreRef.current = false;
    return () => {
      ignoreRef.current = true;
    };
  }, []);

  function handleChange(e) {
    setCode(normaliserCode(e.target.value));
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

    const token = sessionStorage.getItem("token");
    if (!token) {
      setErreur(
        "Vous n'êtes pas connecté. Veuillez vous connecter pour jouer.",
      );
      return;
    }

    setErreur("");
    setTirageEnCours(true);
    const debut = Date.now();

    try {
      const reponse = await fetch(`${API_URL}/tickets/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        if (!ignoreRef.current) {
          setErreur(
            data.error || data.message || "Code invalide ou déjà utilisé.",
          );
          setTirageEnCours(false);
        }
        return;
      }

      const restant = Math.max(
        0,
        dureeAnimationTirage() - (Date.now() - debut),
      );
      if (restant > 0) {
        await attendre(restant);
      }
      if (ignoreRef.current) return;
      navigate("/resultat", { state: { gain: data.gain } });
    } catch {
      if (ignoreRef.current) return;
      setErreur("Erreur de connexion au serveur. Réessayez.");
      setTirageEnCours(false);
    }
  }

  return (
    <main className="enter-code">
      <section className="enter-code-card">
        <h1>🎟️ Participez au jeu</h1>
        <div className="enter-code-tirage">
          <LotoMachine actif={tirageEnCours} />
        </div>

        {tirageEnCours ? (
          <p className="loto-attente" role="status">
            Mélange des boules…
          </p>
        ) : (
          <>
            <p className="enter-code-intro">
              Saisissez le code à <strong>10 caractères</strong> présent sur
              votre ticket de caisse pour découvrir votre gain.
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

              <button type="submit" className="btn-primary">
                Valider mon code
              </button>
            </form>

            {connecte ? (
              <p className="enter-code-aide">
                Vos lots seront enregistrés dans{" "}
                <Link to="/profil">votre profil</Link>.
              </p>
            ) : (
              <p className="enter-code-aide">
                Pas encore inscrit ?{" "}
                <Link to="/inscription">Créez votre compte</Link> pour
                participer. Déjà un compte ?{" "}
                <Link to="/connexion">Connectez-vous</Link>.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
