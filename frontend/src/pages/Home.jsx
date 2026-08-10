import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-badge">🎉 Jeu-concours — 500 000 tickets gagnants</p>
          <h1>100 % des tickets gagnants avec Thé Tip Top !</h1>
          <p className="hero-subtitle">
            Pour célébrer l'ouverture de notre 10ᵉ boutique, chaque achat de 49 € ou plus
            vous offre un code unique. Infusez votre chance, remportez votre thé !
          </p>
          <div className="hero-cta">
            <Link to="/participer" className="btn btn-primary">Je participe 🍵</Link>
            <Link to="/gains" className="btn btn-outline">Découvrir les lots</Link>
          </div>
        </div>
      </section>

      {/* COMMENT PARTICIPER */}
      <section className="steps">
        <h2>Comment participer ?</h2>
        <div className="steps-grid">
          <article className="step-card">
            <span className="step-number" aria-hidden="true">1</span>
            <h3>Achetez</h3>
            <p>
              Effectuez un achat de 49 € ou plus en boutique ou sur notre site et
              recevez un code unique de 10 caractères sur votre ticket de caisse.
            </p>
          </article>
          <article className="step-card">
            <span className="step-number" aria-hidden="true">2</span>
            <h3>Saisissez</h3>
            <p>
              Rendez-vous sur notre plateforme en ligne et entrez votre code pour
              découvrir instantanément votre gain.
            </p>
          </article>
          <article className="step-card">
            <span className="step-number" aria-hidden="true">3</span>
            <h3>Recevez</h3>
            <p>
              Réclamez votre lot en boutique ou en ligne, sous 30 jours après la
              fin du jeu. Et tentez de gagner un an de thé d'une valeur de 360 € !
            </p>
          </article>
        </div>
      </section>

      {/* LES LOTS */}
      <section className="prizes">
        <h2>Les lots à gagner</h2>
        <p className="section-intro">
          <strong>500 000 tickets</strong> seront distribués pendant 30 jours — et chacun est gagnant !
        </p>
        <div className="prizes-grid">
          <article className="prize-card prize-highlight">
            <span className="prize-chance">Le grand tirage</span>
            <p className="prize-value">360 €</p>
            <h3>Un an de thé</h3>
            <p>Un tirage au sort parmi tous les participants à l'issue du jeu.</p>
          </article>
          <article className="prize-card">
            <span className="prize-chance">4 % des tickets</span>
            <p className="prize-value">69 €</p>
            <h3>Coffret découverte prestige</h3>
            <p>Notre sélection premium de thés rares et d'accessoires.</p>
          </article>
          <article className="prize-card">
            <span className="prize-chance">6 % des tickets</span>
            <p className="prize-value">39 €</p>
            <h3>Coffret découverte</h3>
            <p>Un assortiment de nos thés signatures pour explorer nos saveurs.</p>
          </article>
          <article className="prize-card">
            <span className="prize-chance">90 % des tickets</span>
            <p className="prize-value">Surprise</p>
            <h3>Grand thé</h3>
            <p>Un grand thé d'une valeur comprise entre 1 € et 100 € selon votre ticket.</p>
          </article>
        </div>
        <p className="prizes-note">
          📅 Le jeu se déroule sur 30 jours, et vous disposez de 30 jours supplémentaires
          après sa clôture pour saisir vos codes.
        </p>
      </section>

      {/* POURQUOI THÉ TIP TOP */}
      <section className="about">
        <h2>Pourquoi choisir Thé Tip Top ?</h2>
        <div className="about-grid">
          <article>
            <h3>🌱 Bio & responsable</h3>
            <p>
              Tous nos thés sont certifiés biologiques, sourcés directement auprès
              des producteurs, dans une démarche équitable et durable.
            </p>
          </article>
          <article>
            <h3>🍃 Des mélanges signatures</h3>
            <p>
              Des créations exclusives imaginées par nos maîtres infuseurs, du thé
              blanc délicat au thé noir corsé, en passant par nos infusions fruitées.
            </p>
          </article>
          <article>
            <h3>🏪 10 boutiques en France</h3>
            <p>
              Retrouvez nos conseillers passionnés dans nos boutiques pour des
              dégustations et des conseils personnalisés.
            </p>
          </article>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <h2>Prêt à tenter votre chance ?</h2>
        <p>Créez votre compte et saisissez votre premier code en moins de 2 minutes.</p>
        <div className="hero-cta">
          <Link to="/inscription" className="btn btn-primary">Créer mon compte</Link>
          <Link to="/connexion" className="btn btn-outline">J'ai déjà un compte</Link>
        </div>
      </section>
    </>
  );
}