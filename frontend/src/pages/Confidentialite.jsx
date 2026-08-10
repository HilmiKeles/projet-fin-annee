import "../styles/Legal.css";

export default function Confidentialite() {
  return (
    <main className="legal">
      <article className="legal-card">
        <h1>Politique de confidentialité (RGPD)</h1>

        <div className="legal-alerte" role="note">
          ⚠️ Projet étudiant fictif — aucune donnée réelle n'est collectée à
          des fins commerciales.
        </div>

        <h2>Données collectées</h2>
        <p>Dans le cadre du jeu-concours, nous collectons :</p>
        <ul>
          <li>Identité : prénom, nom</li>
          <li>Coordonnées : adresse email</li>
          <li>Participations : codes joués, gains obtenus, dates</li>
        </ul>

        <h2>Finalités du traitement</h2>
        <ul>
          <li>Gestion de votre participation au jeu-concours</li>
          <li>Attribution et remise des lots</li>
          <li>Tirage au sort final (un an de thé)</li>
          <li>Envoi d'emails liés au jeu (avec votre consentement)</li>
        </ul>

        <h2>Base légale et durée de conservation</h2>
        <p>
          Le traitement repose sur votre <strong>consentement</strong> (case à
          cocher lors de l'inscription). Vos données sont conservées pendant la
          durée du jeu-concours, puis <strong>supprimées au plus tard 12 mois
          après sa clôture</strong>.
        </p>

        <h2>Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d'un droit d'accès, de
          rectification, d'effacement, de portabilité et d'opposition. Pour les
          exercer : <strong>rgpd@thetiptop.example</strong>.
        </p>

        <h2>Cookies</h2>
        <p>
          Ce site n'utilise que des cookies strictement nécessaires au
          fonctionnement (session de connexion). Aucun cookie publicitaire ou
          de suivi tiers n'est déposé.
        </p>
      </article>
    </main>
  );
}