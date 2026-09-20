import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  API_URL,
  enTetesAuth,
  enregistrerSession,
  estAdmin,
  estEmploye,
  lireToken,
  roleNormalise,
  viderSession,
} from "../utils/auth";
import { detailsLot } from "../utils/gains";
import "../styles/Admin.css";
import "../styles/Employe.css";

function formaterDate(valeur) {
  if (!valeur) return "—";
  return new Date(valeur).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function estStaff(utilisateur, role) {
  return (
    estEmploye(utilisateur) ||
    estAdmin(utilisateur) ||
    roleNormalise(role) === "EMPLOYEE" ||
    roleNormalise(role) === "ADMIN"
  );
}

export default function Employe() {
  const [etat, setEtat] = useState(() => (lireToken() ? "chargement" : "login"));
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreurAuth, setErreurAuth] = useState("");
  const [chargementAuth, setChargementAuth] = useState(false);
  const [erreurData, setErreurData] = useState("");
  const [gains, setGains] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState("tous");
  const [remiseId, setRemiseId] = useState("");

  async function chargerGains(token) {
    setErreurData("");
    try {
      const reponse = await fetch(`${API_URL}/admin/gains`, {
        headers: enTetesAuth(token),
      });

      if (reponse.status === 401) {
        viderSession();
        setEtat("login");
        return;
      }

      if (reponse.status === 403) {
        setEtat("refuse");
        return;
      }

      const data = await reponse.json().catch(() => ({}));
      if (!reponse.ok) {
        throw new Error(data.error || "Impossible de charger les gagnants.");
      }

      setGains(data.gains || []);
      setEtat("ok");
    } catch (erreur) {
      setErreurData(erreur.message || "Erreur de connexion au serveur.");
      setEtat("ok");
    }
  }

  useEffect(() => {
    const token = lireToken();
    if (!token) {
      setEtat("login");
      return;
    }
    chargerGains(token);
  }, []);

  async function handleConnexion(event) {
    event.preventDefault();
    setErreurAuth("");
    setChargementAuth(true);

    try {
      const reponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: motDePasse,
        }),
      });
      const data = await reponse.json().catch(() => ({}));

      if (!reponse.ok) {
        throw new Error(
          data.error === "Identifiants invalides"
            ? "E-mail ou mot de passe incorrect."
            : data.error || "Identifiants incorrects.",
        );
      }

      const utilisateur = data.user || data.utilisateur || {
        email: email.trim().toLowerCase(),
        role: data.role,
      };

      if (!estStaff(utilisateur, data.role)) {
        setErreurAuth("Ce compte n'a pas les droits employé boutique.");
        return;
      }

      enregistrerSession({
        token: data.token,
        user: { ...utilisateur, role: utilisateur.role || data.role },
        role: data.role,
        email: utilisateur.email,
      });

      setMotDePasse("");
      setEtat("chargement");
      await chargerGains(data.token);
    } catch (erreur) {
      setErreurAuth(erreur.message || "Connexion impossible.");
    } finally {
      setChargementAuth(false);
    }
  }

  async function marquerRemis(id) {
    setRemiseId(id);
    setErreurData("");
    try {
      const reponse = await fetch(`${API_URL}/admin/gain/${id}/claim`, {
        method: "PATCH",
        headers: enTetesAuth(),
      });
      const data = await reponse.json().catch(() => ({}));
      if (!reponse.ok) {
        throw new Error(data.error || "Impossible de marquer le lot comme remis.");
      }
      setGains((liste) =>
        liste.map((gain) =>
          gain.id === id ? { ...gain, claimed: true } : gain,
        ),
      );
    } catch (erreur) {
      setErreurData(erreur.message);
    } finally {
      setRemiseId("");
    }
  }

  const gainsFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return gains.filter((gain) => {
      if (filtre === "a-retirer" && gain.claimed) return false;
      if (filtre === "remis" && !gain.claimed) return false;
      if (!terme) return true;
      const haystack = [
        gain.firstName,
        gain.lastName,
        gain.email,
        gain.code,
        gain.prize,
        detailsLot(gain.prize).libelle,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(terme);
    });
  }, [gains, recherche, filtre]);

  const aRetirer = gains.filter((gain) => !gain.claimed).length;

  if (etat === "chargement") {
    return (
      <main className="admin">
        <p className="admin-chargement">Chargement de l'espace employé...</p>
      </main>
    );
  }

  if (etat === "login" || etat === "refuse") {
    return (
      <main className="admin admin-mur">
        <section className="admin-login">
          <p className="admin-kicker">Boutique</p>
          <h1>Espace employé</h1>
          <p className="admin-intro">
            Connectez-vous pour voir les gagnants et marquer les lots remis en
            magasin.
          </p>

          {etat === "refuse" && (
            <p className="admin-alerte" role="alert">
              Vous êtes connecté, mais ce compte n'a pas les droits employé.
            </p>
          )}
          {erreurAuth && (
            <p className="admin-alerte" role="alert">
              {erreurAuth}
            </p>
          )}

          <form onSubmit={handleConnexion} noValidate autoComplete="off">
            <label htmlFor="employe-email">Adresse e-mail</label>
            <input
              id="employe-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <label htmlFor="employe-password">Mot de passe</label>
            <input
              id="employe-password"
              type="password"
              value={motDePasse}
              onChange={(event) => setMotDePasse(event.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={chargementAuth}>
              {chargementAuth ? "Connexion..." : "Accéder à l'espace employé"}
            </button>
          </form>
          <p className="admin-aide">
            <Link to="/connexion">Page de connexion générale</Link>
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin">
      <header className="admin-entete">
        <div>
          <p className="admin-kicker">Espace employé</p>
          <h1>Gagnants et remises</h1>
          <p>
            Consultez qui a gagné quel lot, puis validez la remise en boutique.
          </p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => chargerGains(lireToken())}
        >
          Actualiser
        </button>
      </header>

      {erreurData && (
        <p className="admin-alerte" role="alert">
          {erreurData}
        </p>
      )}

      <section className="admin-stats" aria-label="Résumé">
        <article>
          <p>Lots gagnés</p>
          <strong>{gains.length}</strong>
        </article>
        <article>
          <p>À retirer</p>
          <strong>{aRetirer}</strong>
        </article>
        <article>
          <p>Remis</p>
          <strong>{gains.length - aRetirer}</strong>
        </article>
      </section>

      <section className="admin-liste">
        <div className="admin-liste-outils">
          <div className="admin-onglets" role="tablist">
            <button
              type="button"
              className={filtre === "tous" ? "actif" : ""}
              onClick={() => setFiltre("tous")}
            >
              Tous ({gains.length})
            </button>
            <button
              type="button"
              className={filtre === "a-retirer" ? "actif" : ""}
              onClick={() => setFiltre("a-retirer")}
            >
              À retirer ({aRetirer})
            </button>
            <button
              type="button"
              className={filtre === "remis" ? "actif" : ""}
              onClick={() => setFiltre("remis")}
            >
              Remis ({gains.length - aRetirer})
            </button>
          </div>
          <input
            type="search"
            placeholder="Nom, e-mail ou code..."
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
            aria-label="Rechercher un gagnant"
          />
        </div>

        {gainsFiltres.length === 0 ? (
          <p className="admin-vide">Aucun gagnant pour ce filtre.</p>
        ) : (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Gagnant</th>
                  <th>Lot</th>
                  <th>Code</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {gainsFiltres.map((gain) => {
                  const lot = detailsLot(gain.prize);
                  return (
                    <tr key={gain.id}>
                      <td>
                        <strong>
                          {gain.firstName} {gain.lastName}
                        </strong>
                        <div className="employe-email">{gain.email}</div>
                      </td>
                      <td>
                        {lot.emoji} {lot.libelle}
                      </td>
                      <td>
                        <code>{gain.code}</code>
                      </td>
                      <td>{formaterDate(gain.wonAt)}</td>
                      <td>
                        <span
                          className={gain.claimed ? "badge-oui" : "badge-non"}
                        >
                          {gain.claimed ? "Remis" : "À retirer"}
                        </span>
                      </td>
                      <td>
                        {gain.claimed ? (
                          "—"
                        ) : (
                          <button
                            type="button"
                            className="btn-primary employe-remise"
                            disabled={remiseId === gain.id}
                            onClick={() => marquerRemis(gain.id)}
                          >
                            {remiseId === gain.id ? "…" : "Marquer remis"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
