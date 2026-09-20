import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { lireToken } from "../utils/auth";
import { CODE_REGEX, normaliserCode } from "../utils/ticketCode.js";
import { validerTicket } from "../utils/tickets.js";
import { attendre, dureeAnimationTirage } from "../utils/tirage.js";
import LotoMachine from "./LotoMachine.jsx";
import "../styles/TirageBoules.css";

export default function TirageBoules() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState("");
  const [etape, setEtape] = useState("saisie");
  const connecte = Boolean(lireToken());
  const ignoreRef = useRef(false);

  useEffect(() => {
    ignoreRef.current = false;
    return () => {
      ignoreRef.current = true;
    };
  }, []);

  function saisirCode(e) {
    setCode(normaliserCode(e.target.value));
    setErreur("");
  }

  async function lancerTirage(e) {
    e.preventDefault();

    if (!CODE_REGEX.test(code)) {
      setErreur(
        "Le code doit contenir exactement 10 caractères (lettres et chiffres).",
      );
      return;
    }

    if (!lireToken()) {
      setErreur("Connectez-vous pour enregistrer votre gain sur votre profil.");
      return;
    }

    setErreur("");
    setEtape("tirage");
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
      navigate("/resultat", { state: { gain: data.gain } });
    } catch (err) {
      if (ignoreRef.current) return;
      setErreur(err.message || "Impossible de lancer le tirage.");
      setEtape("saisie");
    }
  }

  const annonce =
    etape === "tirage" ? "Mélange des boules en cours." : "";

  return (
    <div className="loto">
      <LotoMachine actif={etape === "tirage"} />

      <div className="loto-panneau">
        {etape === "tirage" ? (
          <p className="loto-attente" role="status">
            Mélange des boules…
          </p>
        ) : (
          <form className="loto-form" onSubmit={lancerTirage}>
            <label htmlFor="code-loto">Code de votre ticket de caisse</label>
            <input
              id="code-loto"
              type="text"
              value={code}
              onChange={saisirCode}
              placeholder="ABC123XYZ9"
              autoComplete="off"
              maxLength={10}
              aria-describedby="loto-compteur"
            />
            <span className="loto-compteur" id="loto-compteur">
              {code.length}/10
            </span>

            {erreur && (
              <p className="loto-erreur" role="alert">
                {erreur}
              </p>
            )}

            <button type="submit" className="loto-btn">
              Lancer le tirage
            </button>

            {connecte ? (
              <p className="loto-aide">
                Votre lot sera enregistré dans{" "}
                <Link to="/profil">votre profil</Link>.
              </p>
            ) : (
              <p className="loto-aide">
                <Link to="/connexion">Connectez-vous</Link> ou{" "}
                <Link to="/inscription">créez un compte</Link> avant de jouer,
                sinon le gain ne sera pas enregistré.
              </p>
            )}
          </form>
        )}
      </div>

      <p className="loto-annonce" aria-live="polite">
        {annonce}
      </p>
    </div>
  );
}
