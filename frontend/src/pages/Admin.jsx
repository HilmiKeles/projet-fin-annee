import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  API_URL,
  enTetesAuth,
  enregistrerSession,
  estAdmin,
  lireToken,
  roleNormalise,
  viderSession,
} from "../utils/auth";
import "../styles/Admin.css";

function formaterDate(valeur) {
  if (!valeur) return "—";
  return new Date(valeur).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function telechargerCsv(nomFichier, lignes) {
  const contenu = lignes
    .map((ligne) =>
      ligne
        .map((cellule) => `"${String(cellule ?? "").replace(/"/g, '""')}"`)
        .join(";"),
    )
    .join("\n");
  const blob = new Blob([`\uFEFF${contenu}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = nomFichier;
  lien.click();
  URL.revokeObjectURL(url);
}

export default function Admin() {
  const [etat, setEtat] = useState(() => (lireToken() ? "chargement" : "login"));
  const [email, setEmail] = useState("admin@thetiptop.fr");
  const [motDePasse, setMotDePasse] = useState("");
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
  const [erreurAuth, setErreurAuth] = useState("");
  const [chargementAuth, setChargementAuth] = useState(false);
  const [erreurData, setErreurData] = useState("");
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [abonnes, setAbonnes] = useState([]);
  const [onglet, setOnglet] = useState("newsletter");
  const [recherche, setRecherche] = useState("");

  async function chargerTableauDeBord(token) {
    setErreurData("");

    try {
      const [reponseStats, reponseExport] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: enTetesAuth(token) }),
        fetch(`${API_URL}/admin/export`, { headers: enTetesAuth(token) }),
      ]);

      if (reponseStats.status === 401 || reponseExport.status === 401) {
        viderSession();
        setEtat("login");
        return;
      }

      if (reponseStats.status === 403 || reponseExport.status === 403) {
        setEtat("refuse");
        return;
      }

      const dataStats = await reponseStats.json().catch(() => ({}));
      const dataExport = await reponseExport.json().catch(() => ({}));

      if (!reponseStats.ok || !reponseExport.ok) {
        throw new Error(
          dataStats.error ||
            dataExport.error ||
            "Impossible de charger le back-office.",
        );
      }

      setStats(dataStats);
      setClients(dataExport.clients || []);
      setAbonnes(dataExport.abonnesNewsletter || []);
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
    chargerTableauDeBord(token);
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
            ? "E-mail ou mot de passe incorrect. Utilisez le compte admin, pas votre compte client."
            : data.error || data.message || "Identifiants incorrects.",
        );
      }

      const utilisateur = data.user || data.utilisateur || {
        email: email.trim().toLowerCase(),
        role: data.role,
      };

      if (!estAdmin(utilisateur) && roleNormalise(data.role) !== "ADMIN") {
        setErreurAuth("Ce compte n'a pas les droits administrateur.");
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
      await chargerTableauDeBord(data.token);
    } catch (erreur) {
      setErreurAuth(erreur.message || "Connexion impossible.");
    } finally {
      setChargementAuth(false);
    }
  }

  const abonnesFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    if (!terme) return abonnes;
    return abonnes.filter((abonne) =>
      String(abonne.email || "").toLowerCase().includes(terme),
    );
  }, [abonnes, recherche]);

  const clientsFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    if (!terme) return clients;
    return clients.filter((client) => {
      const haystack = [client.email, client.firstName, client.lastName]
        .join(" ")
        .toLowerCase();
      return haystack.includes(terme);
    });
  }, [clients, recherche]);

  function exporterNewsletter() {
    telechargerCsv("abonnes-newsletter.csv", [
      ["email", "inscrit_le"],
      ...abonnesFiltres.map((abonne) => [
        abonne.email,
        formaterDate(abonne.createdAt),
      ]),
    ]);
  }

  function exporterClients() {
    telechargerCsv("clients.csv", [
      ["prenom", "nom", "email", "newsletter", "inscrit_le"],
      ...clientsFiltres.map((client) => [
        client.firstName,
        client.lastName,
        client.email,
        client.newsletter ? "oui" : "non",
        formaterDate(client.createdAt),
      ]),
    ]);
  }

  if (etat === "chargement") {
    return (
      <main className="admin">
        <p className="admin-chargement">Chargement du back-office...</p>
      </main>
    );
  }

  if (etat === "login" || etat === "refuse") {
    return (
      <main className="admin admin-mur">
        <section className="admin-login">
          <p className="admin-kicker">Espace réservé</p>
          <h1>Administration</h1>
          <p className="admin-intro">
            Connectez-vous avec un compte administrateur pour consulter les
            statistiques et la liste des abonnés newsletter.
          </p>

          {etat === "refuse" && (
            <p className="admin-alerte" role="alert">
              Vous êtes connecté, mais ce compte n'a pas les droits
              administrateur.
            </p>
          )}

          {erreurAuth && (
            <p className="admin-alerte" role="alert">
              {erreurAuth}
            </p>
          )}

          <form onSubmit={handleConnexion} noValidate autoComplete="off">
            <label htmlFor="admin-email">Adresse e-mail admin</label>
            <input
              id="admin-email"
              type="email"
              name="admin-email"
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="admin-password">Mot de passe</label>
            <input
              id="admin-password"
              type={afficherMotDePasse ? "text" : "password"}
              name="admin-password"
              autoComplete="off"
              value={motDePasse}
              onChange={(event) => setMotDePasse(event.target.value)}
              required
            />
            <label className="admin-voir-mdp">
              <input
                type="checkbox"
                checked={afficherMotDePasse}
                onChange={(event) => setAfficherMotDePasse(event.target.checked)}
              />
              Afficher le mot de passe
            </label>

            <button type="submit" className="btn-primary" disabled={chargementAuth}>
              {chargementAuth ? "Connexion..." : "Accéder au back-office"}
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
          <p className="admin-kicker">Back-office</p>
          <h1>Tableau de bord</h1>
          <p>
            Statistiques du jeu-concours et export des abonnés newsletter.
          </p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => chargerTableauDeBord(lireToken())}
        >
          Actualiser
        </button>
      </header>

      {erreurData && (
        <p className="admin-alerte" role="alert">
          {erreurData}
        </p>
      )}

      <section className="admin-stats" aria-label="Statistiques">
        <article>
          <p>Tickets</p>
          <strong>{stats?.ticketsTotal ?? "—"}</strong>
        </article>
        <article>
          <p>Tickets utilisés</p>
          <strong>{stats?.ticketsUsed ?? "—"}</strong>
        </article>
        <article>
          <p>Gains attribués</p>
          <strong>{stats?.totalGains ?? "—"}</strong>
        </article>
        <article>
          <p>Clients</p>
          <strong>{stats?.totalClients ?? "—"}</strong>
        </article>
        <article>
          <p>Abonnés newsletter</p>
          <strong>{abonnes.length}</strong>
        </article>
      </section>

      <section className="admin-liste">
        <div className="admin-liste-outils">
          <div className="admin-onglets" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={onglet === "newsletter"}
              className={onglet === "newsletter" ? "actif" : ""}
              onClick={() => setOnglet("newsletter")}
            >
              Newsletter ({abonnes.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={onglet === "clients"}
              className={onglet === "clients" ? "actif" : ""}
              onClick={() => setOnglet("clients")}
            >
              Clients ({clients.length})
            </button>
          </div>

          <div className="admin-actions">
            <input
              type="search"
              placeholder="Rechercher un e-mail..."
              value={recherche}
              onChange={(event) => setRecherche(event.target.value)}
              aria-label="Rechercher"
            />
            {onglet === "newsletter" ? (
              <button type="button" className="btn-primary" onClick={exporterNewsletter}>
                Exporter CSV
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={exporterClients}>
                Exporter CSV
              </button>
            )}
          </div>
        </div>

        {onglet === "newsletter" ? (
          <div className="admin-table-wrap">
            {abonnesFiltres.length === 0 ? (
              <p className="admin-vide">Aucun abonné newsletter pour le moment.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>E-mail</th>
                    <th>Inscrit le</th>
                  </tr>
                </thead>
                <tbody>
                  {abonnesFiltres.map((abonne) => (
                    <tr key={abonne.email}>
                      <td>{abonne.email}</td>
                      <td>{formaterDate(abonne.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="admin-table-wrap">
            {clientsFiltres.length === 0 ? (
              <p className="admin-vide">Aucun client inscrit.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>E-mail</th>
                    <th>Newsletter</th>
                    <th>Inscrit le</th>
                  </tr>
                </thead>
                <tbody>
                  {clientsFiltres.map((client) => (
                    <tr key={client.email}>
                      <td>
                        {client.firstName} {client.lastName}
                      </td>
                      <td>{client.email}</td>
                      <td>
                        <span className={client.newsletter ? "badge-oui" : "badge-non"}>
                          {client.newsletter ? "Oui" : "Non"}
                        </span>
                      </td>
                      <td>{formaterDate(client.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
