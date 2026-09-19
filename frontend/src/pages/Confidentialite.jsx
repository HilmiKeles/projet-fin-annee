import "../styles/Legal.css";

export default function Confidentialite() {
  return (
    <main className="legal-page">
      <article className="legal-container">
        <h1>Politique de confidentialité</h1>
        <p className="legal-date">Dernière mise à jour : {new Date().getFullYear()}</p>

        <section className="legal-section legal-highlight">
          <h2>⚠️ Projet étudiant fictif</h2>
          <p>
            Ce site est un <strong>projet étudiant</strong> réalisé par l'agence 
            <strong> Furious Ducks</strong>. Aucune donnée réelle n'est collectée 
            à des fins commerciales. Cette politique de confidentialité est 
            rédigée à titre pédagogique pour démontrer la conformité RGPD.
          </p>
        </section>

        <section className="legal-section">
          <h2>1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données à caractère personnel est :
          </p>
          <ul>
            <li><strong>Dénomination sociale :</strong> Thé Tip Top — Société anonyme</li>
            <li><strong>Capital social :</strong> 150 000 €</li>
            <li><strong>Siège social :</strong> 18 rue Léon Frot, 75011 Paris</li>
            <li><strong>Immatriculation :</strong> RCS Paris [numéro à compléter]</li>
            <li><strong>SIRET :</strong> [numéro à compléter]</li>
            <li><strong>Représentant légal :</strong> M. Eric Bourdon, Gérant</li>
            <li><strong>Contact DPO :</strong> dpo@thetiptop.com</li>
          </ul>
          <p>
            <strong>Prestataire technique :</strong> Agence Furious Ducks, 
            agissant en tant que sous-traitant d'hébergement et de développement.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Données collectées et sources</h2>
          
          <h3>2.1 Données directement fournies par l'utilisateur</h3>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Données concernées</th>
                <th>Obligatoire / Facultatif</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Identité</td>
                <td>Civilité, prénom, nom</td>
                <td>Obligatoire</td>
              </tr>
              <tr>
                <td>Coordonnées</td>
                <td>Adresse email, téléphone, adresse postale</td>
                <td>Email obligatoire, autres facultatifs</td>
              </tr>
              <tr>
                <td>Date de naissance</td>
                <td>Jour, mois, année</td>
                <td>Facultatif (profilage gagnants)</td>
              </tr>
              <tr>
                <td>Genre</td>
                <td>Homme, femme, non précisé</td>
                <td>Facultatif (statistiques)</td>
              </tr>
            </tbody>
          </table>

          <h3>2.2 Données générées par la participation</h3>
          <ul>
            <li>Codes à 10 caractères saisis et leurs statuts (gagnant/non gagnant)</li>
            <li>Date et heure de chaque participation</li>
            <li>Gains attribués et leur statut (remis ou non)</li>
            <li>Historique des connexions au compte</li>
          </ul>

          <h3>2.3 Données techniques (logs)</h3>
          <ul>
            <li>Adresse IP (anonymisée après 30 jours)</li>
            <li>Date et heure de connexion</li>
            <li>Type de navigateur et système d'exploitation</li>
            <li>Pages consultées</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Finalités et bases légales du traitement</h2>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Finalité</th>
                <th>Base légale</th>
                <th>Durée de conservation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gestion des participations et attribution des lots</td>
                <td>Exécution du contrat (participation au jeu)</td>
                <td>Durée du jeu + 30 jours</td>
              </tr>
              <tr>
                <td>Tirage au sort final et contact du gagnant</td>
                <td>Exécution du contrat</td>
                <td>Jusqu'à attribution du grand lot</td>
              </tr>
              <tr>
                <td>Envoi d'emails liés au jeu (rappels, gain...)</td>
                <td>Consentement explicite</td>
                <td>Durée du jeu ou jusqu'à révocation</td>
              </tr>
              <tr>
                <td>Emails marketing et newsletters</td>
                <td>Consentement explicite (case séparée)</td>
                <td>3 ans ou jusqu'à révocation</td>
              </tr>
              <tr>
                <td>Statistiques et profilage anonymisé des gagnants</td>
                <td>Intérêt légitime</td>
                <td>5 ans (données agrégées)</td>
              </tr>
              <tr>
                <td>Respect des obligations légales (fraude)</td>
                <td>Obligation légale</td>
                <td>1 an après clôture</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="legal-section">
          <h2>4. Destinataires des données</h2>
          <p>Vos données sont accessibles par :</p>
          <ul>
            <li><strong>Thé Tip Top</strong> et ses employés habilités (gestion du jeu)</li>
            <li><strong>Agence Furious Ducks</strong> (hébergement technique, maintenance)</li>
            <li><strong>Prestataire d'emailing</strong> (envoi des communications, sous-traitant avec DPA signé)</li>
            <li><strong>Autorités compétentes</strong> en cas d'obligation légale</li>
          </ul>
          <p>
            <strong>Aucune vente ni cession</strong> de vos données à des tiers 
            à des fins commerciales n'est effectuée.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Transferts hors de l'Union Européenne</h2>
          <p>
            Les données sont hébergées sur des serveurs situés <strong>dans l'Union Européenne</strong> 
            (France). En cas de recours à un sous-traitant hors UE (outil d'analyse, etc.), 
            des garanties conformes au RGPD (clauses contractuelles types, pays adéquats) 
            seront mises en place préalablement.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Vos droits en vertu du RGPD</h2>
          <p>Vous disposez des droits suivants, exercables gratuitement :</p>

          <h3>6.1 Droit d'accès (art. 15 RGPD)</h3>
          <p>Obtenir une copie de vos données et des informations sur leur traitement.</p>

          <h3>6.2 Droit de rectification (art. 16 RGPD)</h3>
          <p>Demander la correction des données inexactes ou incomplètes.</p>

          <h3>6.3 Droit à l'effacement (« droit à l'oubli », art. 17 RGPD)</h3>
          <p>Demander la suppression de vos données, notamment si le jeu est terminé.</p>

          <h3>6.4 Droit à la limitation du traitement (art. 18 RGPD)</h3>
          <p>Restreindre l'utilisation de vos données dans certains cas.</p>

          <h3>6.5 Droit à la portabilité (art. 20 RGPD)</h3>
          <p>Récupérer vos données dans un format structuré et réutilisable.</p>

          <h3>6.6 Droit d'opposition (art. 21 RGPD)</h3>
          <p>Vous opposer au traitement, notamment pour les prospections commerciales.</p>

          <h3>6.7 Droit de retirer votre consentement</h3>
          <p>
            À tout moment, sans affecter la licéité du traitement antérieur. 
            Cochez/décochez vos préférences dans votre <a href="/profil">profil</a> 
            ou contactez-nous.
          </p>

          <div className="legal-highlight" style={{ marginTop: 24, padding: 20 }}>
            <h3 style={{ marginBottom: 12, borderBottom: 'none' }}>📧 Comment exercer vos droits ?</h3>
            <ul style={{ margin: 0 }}>
              <li><strong>Email :</strong> rgpd@thetiptop.com</li>
              <li><strong>Courrier :</strong> Thé Tip Top — DPO, 18 rue Léon Frot, 75011 Paris</li>
              <li><strong>Délai de réponse :</strong> 1 mois maximum (prolongeable à 3 mois en cas de complexité)</li>
            </ul>
            <p style={{ marginTop: 12, marginBottom: 0, fontSize: '0.9rem' }}>
              <strong>Recours :</strong> En cas de désaccord, vous pouvez saisir la 
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer"> CNIL</a>.
            </p>
          </div>
        </section>

        <section className="legal-section">
          <h2>7. Cookies et traceurs</h2>
          
          <h3>7.1 Cookies strictement nécessaires</h3>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Finalité</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>session_id</td>
                <td>Maintien de la session de connexion</td>
                <td>Session (supprimé à la fermeture du navigateur)</td>
              </tr>
              <tr>
                <td>csrf_token</td>
                <td>Sécurité des formulaires</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>thetiptop_cookie_consent</td>
                <td>Mémorisation de vos choix cookies (stockage local)</td>
                <td>12 mois</td>
              </tr>
            </tbody>
          </table>

          <h3>7.2 Cookies optionnels</h3>
          <p>
            Les cookies de mesure d'audience et de marketing ne sont déposés
            qu'après votre consentement, via le bandeau cookies affiché lors de
            votre première visite. Vous pouvez à tout moment modifier vos choix
            depuis le lien « Gérer les cookies » en pied de page.
            Le refus est aussi simple que l'acceptation.
          </p>

          <h3>7.3 Paramétrage du navigateur</h3>
          <p>
            Vous pouvez configurer votre navigateur pour bloquer les cookies. 
            Attention : cela peut altérer le fonctionnement du site (impossibilité 
            de se connecter).
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Sécurité des données</h2>
          <p>Thé Tip Top met en œuvre les mesures techniques et organisationnelles suivantes :</p>
          <ul>
            <li><strong>Chiffrement :</strong> HTTPS (TLS 1.3), chiffrement des mots de passe (bcrypt)</li>
            <li><strong>Hébergement sécurisé :</strong> Serveurs avec pare-feu, monitoring, backups</li>
            <li><strong>Contrôle d'accès :</strong> Authentification, habilitations, logs d'audit</li>
            <li><strong>Sensibilisation :</strong> Formation des équipes à la protection des données</li>
            <li><strong>PSSI :</strong> Politique de sécurité du système d'information</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>9. Notification des violations de données</h2>
          <p>
            En cas de violation de données personnelles susceptible d'engendrer 
            un risque élevé pour vos droits, Thé Tip Top s'engage à vous en informer 
            dans les <strong>72 heures</strong> suivant la découverte de l'incident, 
            et à notifier la CNIL si nécessaire.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Modification de la politique</h2>
          <p>
            La présente politique peut être mise à jour pour refléter les évolutions 
            légales ou techniques. La date de dernière mise à jour figure en haut de page. 
            Les modifications substantielles vous seront notifiées par email.
          </p>
        </section>

        <section className="legal-section legal-highlight">
          <h2>📋 Documents associés</h2>
          <ul>
            <li><a href="/reglement">Règlement du jeu-concours</a></li>
            <li><a href="/cgu">Conditions générales d'utilisation</a></li>
            <li><a href="/mentions-legales">Mentions légales</a></li>
          </ul>
        </section>
      </article>
    </main>
  );
}