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
  const [quantiteCodes, setQuantiteCodes] = useState(1);
  const [codesCrees, setCodesCrees] = useState([]);
  const [erreurCodes, setErreurCodes] = useState("");
  const [succesCodes, setSuccesCodes] = useState("");
  const [chargementCodes, setChargementCodes] = useState(false);
  const [employes, setEmployes] = useState([]);
  const [emailEmploye, setEmailEmploye] = useState("");
  const [motDePasseEmploye, setMotDePasseEmploye] = useState("");
  const [erreurEmploye, setErreurEmploye] = useState("");
  const [succesEmploye, setSuccesEmploye] = useState("");
  const [chargementEmploye, setChargementEmploye] = useState(false);
  const [promotionEmail, setPromotionEmail] = useState("");

  function enregistrerEmployeDansListes(employe) {
    if (!employe?.email) return;
    setEmployes((liste) => [
      employe,
      ...liste.filter((item) => item.email !== employe.email),
    ]);
    setClients((liste) =>
      liste.filter((client) => client.email !== employe.email),
    );
  }

  async function chargerTableauDeBord(token) {
    setErreurData("");

    try {
      const [reponseStats, reponseExport, reponseEmployes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: enTetesAuth(token) }),
        fetch(`${API_URL}/admin/export`, { headers: enTetesAuth(token) }),
        fetch(`${API_URL}/admin/employes`, { headers: enTetesAuth(token) }),
      ]);

      if (
        reponseStats.status === 401 ||
        reponseExport.status === 401 ||
        reponseEmployes.status === 401
      ) {
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
      const dataEmployes = await reponseEmployes.json().catch(() => ({}));

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
      setEmployes(dataEmployes.employes || []);
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

  async function handleCreationCodes(event) {
    event.preventDefault();
    setErreurCodes("");
    setSuccesCodes("");
    setChargementCodes(true);

    try {
      const reponse = await fetch(`${API_URL}/admin/tickets`, {
        method: "POST",
        headers: enTetesAuth(),
        body: JSON.stringify({ quantite: Number(quantiteCodes) }),
      });
      const data = await reponse.json().catch(() => ({}));

      if (reponse.status === 401) {
        viderSession();
        setEtat("login");
        return;
      }

      if (!reponse.ok) {
        throw new Error(data.error || "Impossible de créer les codes.");
      }

      const codes = data.codes || [];
      setCodesCrees(codes);
      setSuccesCodes(
        codes.length === 1
          ? "1 code créé. Copiez-le pour le tester sur /entrer-code."
          : `${codes.length} codes créés. Copiez-les pour les tester sur /entrer-code.`,
      );
      await chargerTableauDeBord(lireToken());
    } catch (erreur) {
      setErreurCodes(erreur.message || "Impossible de créer les codes.");
    } finally {
      setChargementCodes(false);
    }
  }

  async function copierCodes() {
    if (codesCrees.length === 0 || !navigator.clipboard) return;
    await navigator.clipboard.writeText(codesCrees.join("\n"));
    setSuccesCodes("Codes copiés dans le presse-papiers.");
  }

  async function creerOuPromouvoirEmploye(corps) {
    const reponse = await fetch(`${API_URL}/admin/employes`, {
      method: "POST",
      headers: enTetesAuth(),
      body: JSON.stringify(corps),
    });
    const data = await reponse.json().catch(() => ({}));

    if (reponse.status === 401) {
      viderSession();
      setEtat("login");
      return null;
    }

    if (!reponse.ok) {
      throw new Error(data.error || "Impossible de créer l'employé.");
    }

    enregistrerEmployeDansListes(data.employe);
    return data;
  }

  async function handleCreationEmploye(event) {
    event.preventDefault();
    setErreurEmploye("");
    setSuccesEmploye("");
    setChargementEmploye(true);

    try {
      const data = await creerOuPromouvoirEmploye({
        email: emailEmploye.trim().toLowerCase(),
        password: motDePasseEmploye,
      });
      if (!data) return;
      setSuccesEmploye(data.message);
      setEmailEmploye("");
      setMotDePasseEmploye("");
    } catch (erreur) {
      setErreurEmploye(erreur.message || "Impossible de créer l'employé.");
    } finally {
      setChargementEmploye(false);
    }
  }

  async function promouvoirClient(email) {
    setErreurEmploye("");
    setSuccesEmploye("");
    setPromotionEmail(email);

    try {
      const data = await creerOuPromouvoirEmploye({ email });
      if (!data) return;
      setSuccesEmploye(data.message);
    } catch (erreur) {
      setErreurEmploye(erreur.message || "Impossible de promouvoir ce compte.");
    } finally {
      setPromotionEmail("");
    }
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
            Statistiques du jeu-concours, création d'employés boutique et export
            newsletter.
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

      <section className="admin-codes" aria-labelledby="admin-employes-titre">
        <h2 id="admin-employes-titre">Créer un employé boutique</h2>
        <p>
          Le collègue se connecte ensuite sur « Espace employé » avec cet e-mail
          et ce mot de passe. Mot de passe : 8 caractères min., une majuscule,
          une minuscule et un caractère spécial.
        </p>

        {erreurEmploye && (
          <p className="admin-alerte" role="alert">
            {erreurEmploye}
          </p>
        )}
        {succesEmploye && (
          <p className="admin-succes" role="status">
            {succesEmploye}
          </p>
        )}

        <form className="admin-employe-form" onSubmit={handleCreationEmploye}>
          <div>
            <label htmlFor="admin-employe-email">E-mail</label>
            <input
              id="admin-employe-email"
              type="email"
              value={emailEmploye}
              onChange={(event) => setEmailEmploye(event.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="admin-employe-password">Mot de passe</label>
            <input
              id="admin-employe-password"
              type="password"
              value={motDePasseEmploye}
              onChange={(event) => setMotDePasseEmploye(event.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={chargementEmploye}>
            {chargementEmploye ? "Création..." : "Créer l'employé"}
          </button>
        </form>

        {employes.length > 0 && (
          <div className="admin-codes-resultat">
            <strong>Employés actuels ({employes.length})</strong>
            <ul className="admin-employes-liste">
              {employes.map((employe) => (
                <li key={employe.id || employe.email}>
                  {employe.firstName} {employe.lastName} — {employe.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="admin-codes" aria-labelledby="admin-codes-titre">
        <h2 id="admin-codes-titre">Créer des codes ticket</h2>
        <p>
          Génère des codes à 10 caractères, utilisables une fois sur la page
          « Saisir mon code ».
        </p>

        {erreurCodes && (
          <p className="admin-alerte" role="alert">
            {erreurCodes}
          </p>
        )}
        {succesCodes && (
          <p className="admin-succes" role="status">
            {succesCodes}
          </p>
        )}

        <form className="admin-codes-form" onSubmit={handleCreationCodes}>
          <label htmlFor="admin-quantite-codes">Nombre de codes</label>
          <input
            id="admin-quantite-codes"
            type="number"
            min="1"
            max="20"
            value={quantiteCodes}
            onChange={(event) => setQuantiteCodes(event.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={chargementCodes}>
            {chargementCodes ? "Création..." : "Créer"}
          </button>
        </form>

        {codesCrees.length > 0 && (
          <div className="admin-codes-resultat">
            <div className="admin-codes-resultat-entete">
              <strong>Codes générés</strong>
              <button type="button" className="btn-secondary" onClick={copierCodes}>
                Copier
              </button>
            </div>
            <ul>
              {codesCrees.map((code) => (
                <li key={code}>
                  <code>{code}</code>
                </li>
              ))}
            </ul>
          </div>
        )}
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
                    <th>Action</th>
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
                      <td>
                        <button
                          type="button"
                          className="btn-secondary admin-table-action"
                          disabled={promotionEmail === client.email}
                          onClick={() => promouvoirClient(client.email)}
                        >
                          {promotionEmail === client.email
                            ? "…"
                            : "Rendre employé"}
                        </button>
                      </td>
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
