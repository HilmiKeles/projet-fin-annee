import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Profil.css";

// Correspondance gain → emoji et libellé (même mapping que Result.jsx)
const GAINS = {
  infuseur: { emoji: "🍵", libelle: "Infuseur à thé" },
  detox: { emoji: "🌿", libelle: "Boîte de thé détox 100g" },
  signature: { emoji: "✨", libelle: "Boîte de thé signature 100g" },
  coffret39: { emoji: "🎁", libelle: "Coffret découverte (39€)" },
  coffret69: { emoji: "🏆", libelle: "Coffret découverte premium (69€)" },
};

export default function Account() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    async function chargerDonnees() {
      try {
        // TODO : remplacer par votre appel API réel
        const reponse = await fetch("/api/users/me", {
          credentials: "include",
        });
        const data = await reponse.json();

        if (!reponse.ok) {
          setErreur("Vous devez être connecté pour voir cette page.");
        } else {
          setUtilisateur(data.user);
          setParticipations(data.participations || []);
        }
      } catch {
        setErreur("Erreur de connexion au serveur.");
      } finally {
        setChargement(false);
      }
    }
    chargerDonnees();
  }, []);

  if (chargement) {
    return (
      <main className="account">
        <p className="account-chargement">Chargement de votre compte...</p>
      </main>
    );
  }

  if (erreur) {
    return (
      <main className="account">
        <div className="account-card">
          <h1>👤 Mon compte</h1>
          <p className="erreur" role="alert">{erreur}</p>
          <Link to="/connexion" className="btn-primary">Me connecter</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="account">
      <div className="account-card">
        <h1>👤 Mon compte</h1>

        <section className="account-profil" aria-label="Informations personnelles">
          <p><strong>Prénom :</strong> {utilisateur.firstName}</p>
          <p><strong>Nom :</strong> {utilisateur.lastName}</p>
          <p><strong>Email :</strong> {utilisateur.email}</p>
        </section>

        <section aria-label="Historique des participations">
          <h2>Mes participations ({participations.length})</h2>

          {participations.length === 0 ? (
            <div className="account-vide">
              <p>Vous n'avez pas encore participé au jeu.</p>
              <Link to="/saisie-code" className="btn-primary">
                🎟️ Jouer maintenant
              </Link>
            </div>
          ) : (
            <ul className="account-liste">
              {participations.map((p) => {
                const gain = GAINS[p.prize] || { emoji: "🎁", libelle: p.prize };
                return (
                  <li key={p.id} className={`account-item ${p.claimed ? "remis" : ""}`}>
                    <span className="gain-emoji" aria-hidden="true">{gain.emoji}</span>
                    <div className="gain-details">
                      <strong>{gain.libelle}</strong>
                      <span className="gain-code">Code : {p.code}</span>
                      <span className="gain-date">
                        Joué le {new Date(p.playedAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <span className={`gain-statut ${p.claimed ? "remis" : "a-retirer"}`}>
                      {p.claimed ? "✓ Lot remis" : "À retirer en boutique"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}