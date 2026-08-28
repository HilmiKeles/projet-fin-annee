import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Profil.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const GAINS = {
  infuseur: { emoji: "🍵", libelle: "Infuseur à thé" },
  detox: { emoji: "🌿", libelle: "Boîte de thé détox 100g" },
  signature: { emoji: "✨", libelle: "Boîte de thé signature 100g" },
  coffret39: { emoji: "🎁", libelle: "Coffret découverte (39€)" },
  coffret69: { emoji: "🏆", libelle: "Coffret découverte premium (69€)" },
};

export default function Account() {
  const navigate = useNavigate();
  const [utilisateur, setUtilisateur] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");

  // États pour l'édition du profil
  const [enEdition, setEnEdition] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    newsletter: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // État pour la confirmation de suppression
  const [demandeSuppression, setDemandeSuppression] = useState(false);
  const [actionEnCours, setActionEnCours] = useState(false);

  useEffect(() => {
    async function chargerDonnees() {
      const token = sessionStorage.getItem("token");

      if (!token) {
      setErreur("Vous devez être connecté pour voir cette page.");
      setChargement(false);
      return;
    }
      try {
        const reponse = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = reponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Le backend n'a pas répondu au format JSON (Vérifiez qu'Express tourne bien).");
      }

        const data = await reponse.json();

        if (!reponse.ok) {
          setErreur(data.error || data.message || "Session expirée. Veuillez vous reconnecter.");
        } else {
          setUtilisateur(data.user);
          setParticipations(data.participations || []);
          // Pré-remplir le formulaire
          setForm({
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            email: data.user.email || "",
            newsletter: data.user.newsletter || false,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      } catch {
        setErreur("Erreur au chargement du profil.");
      } finally {
        setChargement(false);
      }
    }
    chargerDonnees();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Soumission de la modification du profil
  const handleUpdate = async (e) => {
    e.preventDefault();
    setErreur("");
    setSuccesMsg("");

    // Vérification mot de passe si saisie d'un nouveau
    if (form.newPassword) {
      if (form.newPassword !== form.confirmPassword) {
        setErreur("Les nouveaux mots de passe ne correspondent pas.");
        return;
      }
      if (form.newPassword.length < 8) {
        setErreur("Le mot de passe doit contenir au moins 8 caractères.");
        return;
      }
      if (!/[A-Z]/.test(form.newPassword)) {
        setErreur("Le mot de passe doit contenir au moins une majuscule.");
        return;
      }
      if (!/[a-z]/.test(form.newPassword)) {
        setErreur("Le mot de passe doit contenir au moins une minuscule.");
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]';`~]/.test(form.newPassword)) {
        setErreur("Le mot de passe doit contenir au moins un caractère spécial.");
        return;
      }
      if (!form.currentPassword) {
        setErreur("Veuillez saisir votre mot de passe actuel pour le modifier.");
        return;
      }
    }

    setActionEnCours(true);

    try {
      const reponse = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          newsletter: form.newsletter,
          currentPassword: form.currentPassword || undefined,
          newPassword: form.newPassword || undefined,
        }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour.");
      }

      setUtilisateur(data.user);
      setSuccesMsg("Votre profil a été mis à jour avec succès !");
      setEnEdition(false);
      // Réinitialiser les champs de mots de passe
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setErreur(err.message);
    } finally {
      setActionEnCours(false);
    }
  };

  // Suppression du compte
  const handleDelete = async () => {
    setActionEnCours(true);
    setErreur("");

    try {
      const reponse = await fetch(`${API_URL}/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!reponse.ok) {
        const data = await reponse.json();
        throw new Error(data.message || "Erreur lors de la suppression.");
      }

      // Nettoyer la session et rediriger vers l'accueil ou connexion
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      navigate("/connexion");
    } catch (err) {
      setErreur(err.message);
      setActionEnCours(false);
    }
  };

  if (chargement) {
    return (
      <main className="account">
        <p className="account-chargement">Chargement de votre compte...</p>
      </main>
    );
  }

  if (erreur && !utilisateur) {
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

  return (
    <main className="account">
      <div className="account-card">
        <h1>👤 Mon compte</h1>

        {succesMsg && <div className="succes-msg">{succesMsg}</div>}
        {erreur && <div className="erreur-msg" role="alert">{erreur}</div>}

        {/* Section Affichage / Édition du Profil */}
        {!enEdition ? (
          <section className="account-profil" aria-label="Informations personnelles">
            <p><strong>Prénom :</strong> {utilisateur.firstName}</p>
            <p><strong>Nom :</strong> {utilisateur.lastName}</p>
            <p><strong>Email :</strong> {utilisateur.email}</p>
            <p>
              <strong>Newsletter :</strong>{" "}
              {utilisateur.newsletter ? "Inscrit(e)" : "Non inscrit(e)"}
            </p>

            <div className="account-actions">
              <button onClick={() => setEnEdition(true)} className="btn-secondary">
                ✏️ Modifier mes informations
              </button>
              <button
                onClick={() => setDemandeSuppression(true)}
                className="btn-danger"
              >
                🗑️ Supprimer mon compte
              </button>
            </div>
          </section>
        ) : (
          <form onSubmit={handleUpdate} className="account-form">
            <h2>Modifier mes informations</h2>

            <div className="form-groupe">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-groupe">
              <label htmlFor="lastName">Nom</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-groupe">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-groupe form-checkbox">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={form.newsletter}
                onChange={handleChange}
              />
              <label htmlFor="newsletter">
                Je souhaite recevoir la newsletter
              </label>
            </div>

            <hr />
            <h3>Changer le mot de passe (optionnel)</h3>

            <div className="form-groupe">
              <label htmlFor="currentPassword">Mot de passe actuel</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Requis pour changer de mot de passe"
              />
            </div>

            <div className="form-groupe">
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Min 8 caract., 1 maj., 1 min., 1 spé."
              />
            </div>

            <div className="form-groupe">
              <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-boutons">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEnEdition(false);
                  setErreur("");
                }}
              >
                Annuler
              </button>
              <button type="submit" className="btn-primary" disabled={actionEnCours}>
                {actionEnCours ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        )}

        {/* Modale / Zone de confirmation de suppression */}
        {demandeSuppression && (
          <div className="modal-suppression">
            <div className="modal-contenu">
              <h3>⚠️ Êtes-vous sûr(e) ?</h3>
              <p>
                Cette action est irréversible. Toutes vos données ainsi que votre
                historique de gains seront définitivement supprimés.
              </p>
              <div className="form-boutons">
                <button
                  className="btn-secondary"
                  onClick={() => setDemandeSuppression(false)}
                >
                  Annuler
                </button>
                <button
                  className="btn-danger"
                  onClick={handleDelete}
                  disabled={actionEnCours}
                >
                  {actionEnCours ? "Suppression..." : "Oui, supprimer définitivement"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section Historique des Participations */}
        <section aria-label="Historique des participations" className="account-participations">
          <h2>Mes participations ({participations.length})</h2>

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
                const gain = GAINS[p.prize] || {
                  emoji: "🎁",
                  libelle: p.prize,
                };
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
                        {new Date(p.playedAt).toLocaleDateString("fr-FR")}
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
      </div>
    </main>
  );
}