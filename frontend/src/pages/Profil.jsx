import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, enTetesAuth, viderSession } from "../utils/auth";
import { extraireParticipations } from "../utils/gains";
import "../styles/Profil.css";

const GAINS = {
  infuseur: { emoji: "🍵", libelle: "Infuseur à thé" },
  detox: { emoji: "🌿", libelle: "Boîte de thé détox 100g" },
  signature: { emoji: "✨", libelle: "Boîte de thé signature 100g" },
  coffret39: { emoji: "🎁", libelle: "Coffret découverte (39€)" },
  coffret69: { emoji: "🏆", libelle: "Coffret découverte premium (69€)" },
};

function detailsGain(prize) {
  if (GAINS[prize]) return GAINS[prize];

  const libelle = String(prize || "Lot");
  const lower = libelle.toLowerCase();
  if (lower.includes("infuseur")) return { ...GAINS.infuseur, libelle };
  if (lower.includes("détox") || lower.includes("detox")) {
    return { ...GAINS.detox, libelle };
  }
  if (lower.includes("signature")) return { ...GAINS.signature, libelle };
  if (lower.includes("39")) return { ...GAINS.coffret39, libelle };
  if (lower.includes("69")) return { ...GAINS.coffret69, libelle };
  return { emoji: "🎁", libelle };
}

function validerNouveauMotDePasse(motDePasse) {
  if (!motDePasse || motDePasse.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  if (!/[A-Z]/.test(motDePasse)) {
    return "Le mot de passe doit contenir au moins une majuscule.";
  }
  if (!/[a-z]/.test(motDePasse)) {
    return "Le mot de passe doit contenir au moins une minuscule.";
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]';`~]/.test(motDePasse)) {
    return "Le mot de passe doit contenir au moins un caractère spécial.";
  }
  return "";
}

export default function Account() {
  const navigate = useNavigate();
  const [utilisateur, setUtilisateur] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [newsletterChargement, setNewsletterChargement] = useState(false);

  const [motDePasseActuel, setMotDePasseActuel] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErreur, setPasswordErreur] = useState("");
  const [passwordChargement, setPasswordChargement] = useState(false);

  const [motDePasseSuppression, setMotDePasseSuppression] = useState("");
  const [confirmationSuppression, setConfirmationSuppression] = useState(false);
  const [suppressionErreur, setSuppressionErreur] = useState("");
  const [suppressionChargement, setSuppressionChargement] = useState(false);

  useEffect(() => {
    async function chargerDonnees() {
      try {
        const reponse = await fetch(`${API_URL}/users/me`, {
          headers: enTetesAuth(),
        });

        const data = await reponse.json();

        if (!reponse.ok) {
          setErreur("Vous devez être connecté pour voir cette page.");
        } else {
          setUtilisateur(data.user);
          let liste = extraireParticipations(data);
          const aucuneListeFournie =
            !Array.isArray(data.participations) && !Array.isArray(data.gains);

          if (liste.length === 0 && aucuneListeFournie) {
            const reponseGains = await fetch(`${API_URL}/tickets/my-gains`, {
              headers: enTetesAuth(),
            });
            if (reponseGains.ok) {
              const brut = await reponseGains.json();
              liste = extraireParticipations({
                gains: Array.isArray(brut)
                  ? brut
                  : brut.gains || brut.participations,
              });
            }
          }

          setParticipations(liste);
          setNewsletter(Boolean(data.user?.newsletter));
        }
      } catch {
        setErreur("Erreur au chargement du profil.");
      } finally {
        setChargement(false);
      }
    }
    chargerDonnees();
  }, []);

  const handleNewsletter = async (cochee) => {
    setNewsletter(cochee);
    setNewsletterMsg("");
    setNewsletterChargement(true);

    try {
      const reponse = await fetch(`${API_URL}/newsletter/preference`, {
        method: "PATCH",
        headers: enTetesAuth(),
        body: JSON.stringify({ newsletter: cochee }),
      });

      const data = await reponse.json().catch(() => ({}));

      if (!reponse.ok) {
        setNewsletter(!cochee);
        setNewsletterMsg(data.error || "Impossible de mettre à jour la newsletter.");
        return;
      }

      setNewsletterMsg(
        cochee
          ? "Vous êtes inscrit(e) à la newsletter."
          : "Vous ne recevrez plus la newsletter.",
      );
    } catch {
      setNewsletter(!cochee);
      setNewsletterMsg("Erreur réseau. Réessayez.");
    } finally {
      setNewsletterChargement(false);
    }
  };

  const handleChangerMotDePasse = async (event) => {
    event.preventDefault();
    setPasswordMsg("");
    setPasswordErreur("");

    const erreurFormat = validerNouveauMotDePasse(nouveauMotDePasse);
    if (erreurFormat) {
      setPasswordErreur(erreurFormat);
      return;
    }

    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setPasswordErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    if (nouveauMotDePasse === motDePasseActuel) {
      setPasswordErreur("Le nouveau mot de passe doit être différent de l'actuel.");
      return;
    }

    setPasswordChargement(true);
    try {
      const reponse = await fetch(`${API_URL}/users/me/password`, {
        method: "PATCH",
        headers: enTetesAuth(),
        body: JSON.stringify({
          currentPassword: motDePasseActuel,
          newPassword: nouveauMotDePasse,
        }),
      });
      const data = await reponse.json().catch(() => ({}));

      if (!reponse.ok) {
        setPasswordErreur(
          data.error || data.message || "Impossible de modifier le mot de passe.",
        );
        return;
      }

      setPasswordMsg(data.message || "Mot de passe mis à jour.");
      setMotDePasseActuel("");
      setNouveauMotDePasse("");
      setConfirmationMotDePasse("");
    } catch {
      setPasswordErreur("Erreur réseau. Réessayez.");
    } finally {
      setPasswordChargement(false);
    }
  };

  const handleSupprimerCompte = async (event) => {
    event.preventDefault();
    setSuppressionErreur("");

    if (!confirmationSuppression) {
      setSuppressionErreur(
        "Cochez la case pour confirmer la suppression définitive.",
      );
      return;
    }

    if (!motDePasseSuppression) {
      setSuppressionErreur("Saisissez votre mot de passe pour confirmer.");
      return;
    }

    setSuppressionChargement(true);
    try {
      const reponse = await fetch(`${API_URL}/users/me`, {
        method: "DELETE",
        headers: enTetesAuth(),
        body: JSON.stringify({ password: motDePasseSuppression }),
      });
      const data = await reponse.json().catch(() => ({}));

      if (!reponse.ok) {
        setSuppressionErreur(
          data.error || data.message || "Impossible de supprimer le compte.",
        );
        return;
      }

      viderSession();
      navigate("/", { replace: true });
    } catch {
      setSuppressionErreur("Erreur réseau. Réessayez.");
    } finally {
      setSuppressionChargement(false);
    }
  };

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
          <p className="erreur" role="alert">
            {erreur}
          </p>
          <Link to="/connexion" className="btn-primary">
            Me connecter
          </Link>
        </div>
      </main>
    );
  }

  const lotsARetirer = participations.filter((p) => !p.claimed).length;

  return (
    <main className="account">
      <div className="account-card">
        <h1>👤 Mon compte</h1>

        <section
          className="account-profil"
          aria-label="Informations personnelles"
        >
          <p>
            <strong>Prénom :</strong> {utilisateur.firstName}
          </p>
          <p>
            <strong>Nom :</strong> {utilisateur.lastName}
          </p>
          <p>
            <strong>Email :</strong> {utilisateur.email}
          </p>
        </section>

        <section className="account-newsletter" aria-label="Newsletter">
          <h2>Newsletter</h2>
          <label className="account-newsletter-toggle">
            <input
              type="checkbox"
              checked={newsletter}
              disabled={newsletterChargement}
              onChange={(event) => handleNewsletter(event.target.checked)}
            />
            <span>Recevoir la newsletter Thé Tip Top (recettes, boutiques, jeu-concours)</span>
          </label>
          {newsletterMsg && (
            <p className="account-newsletter-msg" role="status">
              {newsletterMsg}
            </p>
          )}
          <p className="account-newsletter-lien">
            <Link to="/newsletter">Lire l'aperçu</Link>
            {" · "}
            <Link to="/newsletter/desinscription">Page de désinscription</Link>
          </p>
        </section>

        <section aria-label="Historique des gains">
          <h2>Mes gains ({participations.length})</h2>
          {lotsARetirer > 0 && (
            <p className="account-gains-alerte" role="status">
              {lotsARetirer} lot{lotsARetirer > 1 ? "s" : ""} à retirer en
              boutique. Présentez-vous avec une pièce d'identité.
            </p>
          )}

          {participations.length === 0 ? (
            <div className="account-vide">
              <p>Vous n'avez pas encore participé au jeu.</p>
              <Link to="/entrer-code" className="btn-primary">
                🎟️ Jouer maintenant
              </Link>
            </div>
          ) : (
            <ul className="account-liste">
              {participations.map((p) => {
                const gain = detailsGain(p.prize);
                return (
                  <li
                    key={p.id}
                    className={`account-item ${p.claimed ? "remis" : ""}`}
                  >
                    <span className="gain-emoji" aria-hidden="true">
                      {gain.emoji}
                    </span>
                    <div className="gain-details">
                      <strong>{gain.libelle}</strong>
                      <span className="gain-code">Code : {p.code}</span>
                      <span className="gain-date">
                        Joué le{" "}
                        {p.playedAt
                          ? new Date(p.playedAt).toLocaleDateString("fr-FR")
                          : "—"}
                      </span>
                    </div>
                    <span
                      className={`gain-statut ${p.claimed ? "remis" : "a-retirer"}`}
                    >
                      {p.claimed ? "✓ Lot remis" : "À retirer en boutique"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-label="Modifier le mot de passe">
          <h2>Modifier mon mot de passe</h2>
          <form className="account-form" onSubmit={handleChangerMotDePasse}>
            <div className="form-groupe">
              <label htmlFor="motdepasse-actuel">Mot de passe actuel</label>
              <input
                id="motdepasse-actuel"
                type="password"
                autoComplete="current-password"
                value={motDePasseActuel}
                onChange={(event) => setMotDePasseActuel(event.target.value)}
                required
              />
            </div>
            <div className="form-groupe">
              <label htmlFor="nouveau-motdepasse">Nouveau mot de passe</label>
              <input
                id="nouveau-motdepasse"
                type="password"
                autoComplete="new-password"
                value={nouveauMotDePasse}
                onChange={(event) => setNouveauMotDePasse(event.target.value)}
                required
              />
              <p className="champ-aide">
                8 caractères minimum, avec majuscule, minuscule et caractère
                spécial.
              </p>
            </div>
            <div className="form-groupe">
              <label htmlFor="confirmation-motdepasse">
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="confirmation-motdepasse"
                type="password"
                autoComplete="new-password"
                value={confirmationMotDePasse}
                onChange={(event) =>
                  setConfirmationMotDePasse(event.target.value)
                }
                required
              />
            </div>
            {passwordErreur && (
              <p className="erreur" role="alert">
                {passwordErreur}
              </p>
            )}
            {passwordMsg && (
              <p className="account-succes" role="status">
                {passwordMsg}
              </p>
            )}
            <button
              type="submit"
              className="btn-primary"
              disabled={passwordChargement}
            >
              {passwordChargement
                ? "Enregistrement..."
                : "Enregistrer le mot de passe"}
            </button>
          </form>
        </section>

        <section className="account-danger" aria-label="Supprimer le compte">
          <h2>Supprimer mon compte</h2>
          <p>
            Cette action est définitive. Vos informations et vos gains non
            retirés seront perdus.
          </p>
          <form className="account-form" onSubmit={handleSupprimerCompte}>
            <div className="form-groupe">
              <label htmlFor="motdepasse-suppression">
                Mot de passe de confirmation
              </label>
              <input
                id="motdepasse-suppression"
                type="password"
                autoComplete="current-password"
                value={motDePasseSuppression}
                onChange={(event) =>
                  setMotDePasseSuppression(event.target.value)
                }
                required
              />
            </div>
            <label className="account-newsletter-toggle">
              <input
                type="checkbox"
                checked={confirmationSuppression}
                onChange={(event) =>
                  setConfirmationSuppression(event.target.checked)
                }
              />
              <span>Je confirme vouloir supprimer définitivement mon compte.</span>
            </label>
            {suppressionErreur && (
              <p className="erreur" role="alert">
                {suppressionErreur}
              </p>
            )}
            <button
              type="submit"
              className="btn-danger"
              disabled={suppressionChargement}
            >
              {suppressionChargement
                ? "Suppression..."
                : "Supprimer mon compte"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
