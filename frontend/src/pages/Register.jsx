import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

// RGPD : mot de passe fort requis (8 car. min, majuscule, minuscule, chiffre)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    rgpd: false,
  });
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErreur("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!PASSWORD_REGEX.test(form.password)) {
      setErreur("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.");
      return;
    }
    if (form.password !== form.confirm) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!form.rgpd) {
      setErreur("Vous devez accepter la politique de confidentialité pour participer.");
      return;
    }

    setChargement(true);

    try {
      const reponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        setErreur(data.message || "Impossible de créer votre compte.");
      } else {
        navigate("/mon-compte");
      }
    } catch {
      setErreur("Erreur de connexion au serveur. Réessayez.");
    } finally {
      setChargement(false);
    }
  }

  return (
    <main className="auth">
      <section className="auth-card">
        <h1>📝 Inscription</h1>
        <p className="auth-intro">
          Créez votre compte pour participer au jeu-concours Thé Tip Top.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-ligne">
            <div className="auth-champ">
              <label htmlFor="firstName">Prénom</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                required
              />
            </div>
            <div className="auth-champ">
              <label htmlFor="lastName">Nom</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <label htmlFor="email">Adresse email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="marie.dupont@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="8 caractères min., 1 majuscule, 1 chiffre"
            autoComplete="new-password"
            required
          />

          <label htmlFor="confirm">Confirmer le mot de passe</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <div className="auth-rgpd">
            <input
              id="rgpd"
              name="rgpd"
              type="checkbox"
              checked={form.rgpd}
              onChange={handleChange}
              required
            />
            <label htmlFor="rgpd">
              J'accepte la <Link to="/confidentialite">politique de confidentialité</Link>.
              Mes données sont utilisées uniquement dans le cadre du jeu-concours.
            </label>
          </div>

          {erreur && <p className="erreur" role="alert">{erreur}</p>}

          <button type="submit" className="btn-primary" disabled={chargement}>
            {chargement ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="auth-aide">
          Déjà inscrit ? <Link to="/connexion">Connectez-vous</Link>
        </p>
      </section>
    </main>
  );
}