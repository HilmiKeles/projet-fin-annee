import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import GoogleButton from "../components/GoogleButton.jsx";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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

  const handleGoogleResponse = async (response) => {
    setErreurs({});
    try {
      const reponse = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        throw new Error(data.error || "Inscription Google échouée");
      }
      if (data.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem(
          "user",
          JSON.stringify(data.user || { role: data.role }),
        );
      }
      navigate("/profil");
    } catch (err) {
      setErreurs({
        global: err.message || "Erreur lors de l'inscription via Google.",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
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
    } else if (!/[A-Z]/.test(form.motDePasse)) {
      nouvellesErreurs.motDePasse =
        "Le mot de passe doit contenir au moins une majuscule.";
    } else if (!/[a-z]/.test(form.motDePasse)) {
      nouvellesErreurs.motDePasse =
        "Le mot de passe doit contenir au moins une minuscule.";
    } else if (
      !/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]';`~]/.test(form.motDePasse)
    ) {
      nouvellesErreurs.motDePasse =
        "Le mot de passe doit contenir au moins un caractère spécial.";
    }

    if (form.confirmation !== form.motDePasse) {
      nouvellesErreurs.confirmation =
        "Les mots de passe ne correspondent pas.";
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

      if (data.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem(
          "user",
          JSON.stringify(data.utilisateur || data.user || data),
        );
        navigate("/profil");
      } else {
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

        {GOOGLE_CLIENT_ID && (
          <>
            <GoogleButton onSuccess={handleGoogleResponse} text="signup_with" />
            <div>
              <span>ou créez un compte avec votre e-mail</span>
            </div>
          </>
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
              />
              {erreurs.prenom && (
                <p className="champ-erreur">{erreurs.prenom}</p>
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
              />
              {erreurs.nom && <p className="champ-erreur">{erreurs.nom}</p>}
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
            />
            {erreurs.email && <p className="champ-erreur">{erreurs.email}</p>}
          </div>

          <div className="form-ligne">
            <div className="form-groupe">
              <label htmlFor="motDePasse">Mot de passe</label>
              <input
                type="password"
                id="motDePasse"
                name="motDePasse"
                value={form.motDePasse}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {erreurs.motDePasse && (
                <p className="champ-erreur">{erreurs.motDePasse}</p>
              )}
            </div>

            <div className="form-groupe">
              <label htmlFor="confirmation">Confirmation du mot de passe</label>
              <input
                type="password"
                id="confirmation"
                name="confirmation"
                value={form.confirmation}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {erreurs.confirmation && (
                <p className="champ-erreur">{erreurs.confirmation}</p>
              )}
            </div>
          </div>

          <div className="form-groupe form-checkbox">
            <label>
              <input
                type="checkbox"
                name="consentement"
                checked={form.consentement}
                onChange={handleChange}
              />
              J'accepte le règlement du jeu *
            </label>
            {erreurs.consentement && (
              <p className="champ-erreur">{erreurs.consentement}</p>
            )}
          </div>

          <div className="form-groupe form-checkbox">
            <label>
              <input
                type="checkbox"
                name="newsletter"
                checked={form.newsletter}
                onChange={handleChange}
              />
              Je souhaite recevoir la newsletter
            </label>
          </div>

          <button type="submit" className="btn-primary auth-bouton" disabled={chargement}>
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