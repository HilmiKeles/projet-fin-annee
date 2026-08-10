import "../styles/Legal.css";

export default function MentionsLegales() {
  return (
    <main className="legal">
      <article className="legal-card">
        <h1>Mentions légales</h1>

        <div className="legal-alerte" role="note">
          ⚠️ Ce site est un <strong>projet étudiant fictif</strong> réalisé dans
          un cadre pédagogique. Aucun achat réel ni aucune réservation ne peut y
          être effectué.
        </div>

        <h2>Éditeur du site</h2>
        <p>
          <strong>Thé Tip Top</strong> — SA au capital social de 150 000 €<br />
          Siège social : 18 rue Léon Frot, 75011 Paris<br />
          Gérant : M. Eric Bourdon<br />
          Email : contact@thetiptop.example
        </p>

        <h2>Réalisation du site</h2>
        <p>
          <strong>Agence Furious Ducks</strong> — Spécialiste des technologies
          open source<br />
          Site réalisé dans le cadre d'un projet de fin d'année — DSP5 Archi
          Web.
        </p>

        <h2>Hébergement</h2>
        <p>
          Site hébergé sur les serveurs de l'agence dans le cadre du workflow
          CI/CD du projet (domaine dsp5-archi-*.fr).
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus du site (textes, visuels, logo) est fourni à
          titre fictif et pédagogique. Toute reproduction en dehors du cadre du
          projet est interdite.
        </p>

        <h2>Jeu-concours</h2>
        <p>
          Le jeu-concours présenté sur ce site est fictif. Aucun lot ne sera
          réellement attribué. Consulter le{" "}
          <a href="/reglement">règlement du jeu</a> et la{" "}
          <a href="/confidentialite">politique de confidentialité</a>.
        </p>
      </article>
    </main>
  );
}