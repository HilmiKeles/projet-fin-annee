import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

// URL de l'API : utilise la variable d'env Vite au build,
// sinon fallback sur /api (proxyfié par nginx vers le backend)
const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function Inscription() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    motDePasse: "",
    confirmation: "",
    consentement: false,
    newsletter: false,
  });
  const [erreurs, setErreurs] = useState({});
  const [chargement, setChargement] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    // Efface l'erreur du champ modifié
    if (erreurs[name]) {
      setErreurs({ ...erreurs, [name]: "" });
    }
  };

  const valider = () => {
    const nouvellesErreurs = {};

    if (!form.prenom.trim())
      nouvellesErreurs.prenom = "Le prénom est obligatoire.";
    if (!form.nom.trim()) nouvellesErreurs.nom = "Le nom est obligatoire.";

    if (!form.email.trim()) {
      nouvellesErreurs.email = "L'adresse e-mail est obligatoire.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nouvellesErreurs.email = "L'adresse e-mail n'est pas valide.";
    }

    if (!form.motDePasse) {
      nouvellesErreurs.motDePasse = "Le mot de passe est obligatoire.";
    } else if (form.motDePasse.length < 8) {
      nouvellesErreurs.motDePasse =
        "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (form.confirmation !== form.motDePasse) {
      nouvellesErreurs.confirmation = "Les mots de passe ne correspondent pas.";
    }

    if (!form.consentement) {
      nouvellesErreurs.consentement =
        "Vous devez accepter le règlement du jeu pour participer.";
    }

    return nouvellesErreurs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nouvellesErreurs = valider();

    if (Object.keys(nouvellesErreurs).length > 0) {
      setErreurs(nouvellesErreurs);
      return;
    }

    setChargement(true);

    try {
      // 1. Appel à l'API backend (via le proxy nginx /api en production)
      const reponse = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.prenom,
          lastName: form.nom,
          email: form.email,
          password: form.motDePasse,
          newsletter: form.newsletter,
        }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      // 2. Si le backend connecte l'utilisateur direct après l'inscription (renvoie un token)
      if (data.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem(
          "user",
          JSON.stringify(data.utilisateur || data.user || data),
        );
        navigate("/profil");
      } else {
        // Sinon, on le renvoie vers la page de connexion pour qu'il se connecte lui-même
        navigate("/connexion");
      }
    } catch (err) {
      setErreurs({
        global: err.message || "Une erreur est survenue, veuillez réessayer.",
      });
    } finally {
      setChargement(false);
    }
  };

  return (
    <main className="auth">
      <section className="auth-card auth-card-large">
        <div className="auth-emoji" aria-hidden="true">
          🌱
        </div>
        <h1>Créer mon compte</h1>
        <p className="auth-intro">
          Inscrivez-vous gratuitement pour saisir le code de votre ticket de
          caisse et découvrir votre lot. 100% des tickets sont gagnants !
        </p>

        {erreurs.global && (
          <div className="auth-erreur" role="alert">
            {erreurs.global}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-ligne">
            <div className="form-groupe">
              <label htmlFor="prenom">Prénom</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                autoComplete="given-name"
                required
                placeholder="Votre prénom"
                aria-invalid={!!erreurs.prenom}
                aria-describedby={erreurs.prenom ? "erreur-prenom" : undefined}
              />
              {erreurs.prenom && (
                <p className="champ-erreur" id="erreur-prenom">
                  {erreurs.prenom}
                </p>
              )}
            </div>

            <div className="form-groupe">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                autoComplete="family-name"
                required
                placeholder="Votre nom"
                aria-invalid={!!erreurs.nom}
                aria-describedby={erreurs.nom ? "erreur-nom" : undefined}
              />
              {erreurs.nom && (
                <p className="champ-erreur" id="erreur-nom">
                  {erreurs.nom}
                </p>
              )}
            </div>
          </div>

          <div className="form-groupe">
            <label htmlFor="email">Adresse e-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
              placeholder="exemple@email.fr"
              aria-invalid={!!erreurs.email}
              aria-describedby={erreurs.email ? "erreur-email" : undefined}
            />
            {erreurs.email && (
              <p className="champ-erreur" id="erreur-email">
                {erreurs.email}
              </p>
            )}
          </div>

          <div className="form-ligne">
            <div className="form-groupe">
              <label htmlFor="motdepasse">Mot de passe</label>
              <input
                type="password"
                id="motdepasse"
                name="motDePasse"
                value={form.motDePasse}
                onChange={handleChange}
                autoComplete="new-password"
                required
                placeholder="8 caractères minimum"
                aria-invalid={!!erreurs.motDePasse}
                aria-describedby={
                  erreurs.motDePasse ? "erreur-mdp" : "aide-mdp"
                }
              />
              <p className="champ-aide" id="aide-mdp">
                Minimum 8 caractères.
              </p>
              {erreurs.motDePasse && (
                <p className="champ-erreur" id="erreur-mdp">
                  {erreurs.motDePasse}
                </p>
              )}
            </div>

            <div className="form-groupe">
              <label htmlFor="confirmation">Confirmation</label>
              <input
                type="password"
                id="confirmation"
                name="confirmation"
                value={form.confirmation}
                onChange={handleChange}
                autoComplete="new-password"
                required
                placeholder="Répétez le mot de passe"
                aria-invalid={!!erreurs.confirmation}
                aria-describedby={
                  erreurs.confirmation ? "erreur-confirmation" : undefined
                }
              />
              {erreurs.confirmation && (
                <p className="champ-erreur" id="erreur-confirmation">
                  {erreurs.confirmation}
                </p>
              )}
            </div>
          </div>

          <div className="form-groupe form-checkbox">
            <input
              type="checkbox"
              id="consentement"
              name="consentement"
              checked={form.consentement}
              onChange={handleChange}
              required
              aria-invalid={!!erreurs.consentement}
              aria-describedby={
                erreurs.consentement ? "erreur-consentement" : undefined
              }
            />
            <label htmlFor="consentement">
              J'accepte le{" "}
              <Link to="/reglement">règlement du jeu-concours</Link> et la{" "}
              <Link to="/politique-confidentialite">
                politique de confidentialité
              </Link>
              .
            </label>
          </div>
          {erreurs.consentement && (
            <p className="champ-erreur" id="erreur-consentement">
              {erreurs.consentement}
            </p>
          )}

          <div className="form-groupe form-checkbox">
            <input
              type="checkbox"
              id="newsletter"
              name="newsletter"
              checked={form.newsletter}
              onChange={handleChange}
            />
            <label htmlFor="newsletter">
              Je souhaite recevoir par e-mail les actualités et offres de Thé
              Tip Top (optionnel, désinscription possible à tout moment).
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary auth-bouton"
            disabled={chargement}
          >
            {chargement
              ? "Création du compte..."
              : "Créer mon compte et participer"}
          </button>
        </form>

        <p className="auth-lien">
          Déjà inscrit ? <Link to="/connexion">Connectez-vous</Link>
        </p>
      </section>
    </main>
  );
}