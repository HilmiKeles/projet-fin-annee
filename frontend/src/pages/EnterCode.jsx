import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LotoMachine from "../components/LotoMachine.jsx";
import { lireToken } from "../utils/auth";
import { CODE_REGEX, normaliserCode } from "../utils/ticketCode.js";
import { validerTicket } from "../utils/tickets.js";
import { attendre, dureeAnimationTirage } from "../utils/tirage.js";
import { suivreConversion, suivreCta } from "../utils/analytics";
import "../styles/EnterCode.css";

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

    if (!lireToken()) {
      setErreur(
        "Vous n'êtes pas connecté. Veuillez vous connecter pour jouer.",
      );
      return;
    }

    setErreur("");
    setTirageEnCours(true);
    const debut = Date.now();

    try {
      const data = await validerTicket(code);
      const restant = Math.max(
        0,
        dureeAnimationTirage() - (Date.now() - debut),
      );
      if (restant > 0) {
        await attendre(restant);
      }
      if (ignoreRef.current) return;
      suivreCta("valider-code");
      suivreConversion(data.gain);
      navigate("/resultat", { state: { gain: data.gain } });
    } catch (err) {
      if (ignoreRef.current) return;
      setErreur(err.message || "Erreur de connexion au serveur. Réessayez.");
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

            <form onSubmit={connecte ? handleSubmit : (e) => e.preventDefault()}>
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

              {connecte ? (
                <button type="submit" className="btn-primary">
                  Valider mon code
                </button>
              ) : (
                <Link to="/connexion" className="btn-primary">
                  Connectez-vous pour jouer
                </Link>
              )}
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
