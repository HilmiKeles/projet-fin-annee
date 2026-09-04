import "../styles/Legal.css";

export default function MentionsLegales() {
  return (
    <main className="legal-page">
      <article className="legal-container">
        <h1>Mentions légales</h1>
        <p className="legal-date">Dernière mise à jour : 2026</p>

        <section className="legal-section legal-highlight">
          <h2>⚠️ Projet étudiant fictif</h2>
          <p>
            Ce site est un <strong>projet étudiant fictif</strong> réalisé dans
            un cadre pédagogique par l'agence <strong>Furious Ducks</strong>. 
            Aucun achat réel, aucune réservation et aucun gain réel ne peut y être effectué.
          </p>
        </section>

        <section className="legal-section">
          <h2>Éditeur du site</h2>
          <p>
            <strong>Thé Tip Top</strong> — Société anonyme au capital social de 150 000 €
          </p>
          <ul>
            <li><strong>Siège social :</strong> 18 rue Léon Frot, 75011 Paris</li>
            <li><strong>Gérant :</strong> M. Eric Bourdon</li>
            <li><strong>Email :</strong> contact@thetiptop.com</li>
            <li><strong>SIRET :</strong> [à compléter si fictif]</li>
            <li><strong>RCS :</strong> Paris [à compléter]</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Réalisation du site</h2>
          <p>
            <strong>Agence Furious Ducks</strong> — Spécialiste des technologies open source
          </p>
          <ul>
            <li><strong>Directeur :</strong> M. Guido Brasletti</li>
            <li><strong>Projet :</strong> Soutenance ESTD — DSP5 Archi Web</li>
            <li><strong>Année académique :</strong> 2025-2026</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Hébergement</h2>
          <p>
            Site hébergé sur serveur dédié dans le cadre du workflow CI/CD du projet.
          </p>
          <ul>
            <li><strong>URL du site :</strong> dsp5-archi-[classe]-[groupe].fr</li>
            <li><strong>Hébergeur :</strong> [O2Switch/Infomaniak/autre — selon votre choix réel]</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus du site (textes, photographies, illustrations, logo, 
            code source) est protégé par le droit français de la propriété intellectuelle.
          </p>
          <p>
            Dans le cadre de ce <strong>projet étudiant fictif</strong>, les éléments sont 
            fournis à titre pédagogique. Toute reproduction, représentation ou utilisation 
            en dehors du cadre académique est strictement interdite sans autorisation écrite préalable.
          </p>
        </section>

        <section className="legal-section">
          <h2>Cookies et technologies de suivi</h2>
          <p>
            Ce site utilise des cookies techniques nécessaires à son fonctionnement
            (navigation, authentification). Les cookies optionnels ne sont déposés
            qu'après un consentement explicite via le bandeau cookies.
            Vous pouvez modifier vos choix à tout moment depuis le pied de page.
          </p>
          <p>
            Pour en savoir plus, consultez notre <a href="/confidentialite">politique de confidentialité</a>.
          </p>
        </section>

        <section className="legal-section">
          <h2>Jeu-concours — Conditions particulières</h2>
          <p>
            Le jeu-concours <strong>« Grand Jeu-Concours Thé Tip Top »</strong> est intégré 
            à ce site. Pour les conditions détaillées :
          </p>
          <ul>
            <li><a href="/reglement">Règlement complet du jeu</a></li>
            <li><a href="/cgu">Conditions générales d'utilisation</a></li>
            <li><a href="/confidentialite">Politique de confidentialité et RGPD</a></li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Contact</h2>
          <p>
            Pour toute question relative aux mentions légales ou au fonctionnement du site :
          </p>
          <ul>
            <li><strong>Email :</strong> contact@thetiptop.com</li>
            <li><strong>Adresse :</strong> 18 rue Léon Frot, 75011 Paris</li>
          </ul>
        </section>
      </article>
    </main>
  );
}