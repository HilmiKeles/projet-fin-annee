import { Link } from 'react-router-dom';
import TirageBoules from '../components/TirageBoules.jsx';
import { DUREE_JOURS, dateClotureLisible, joursAvantCloture } from '../config/jeu.js';
import '../styles/Home.css';

const TITRE = 'Lancez le tirage et tentez de remporter un cadeau';

// Éléments qui remontent en fond du bandeau (position en %, durée en secondes).
const DECOR = [
  { emoji: '🍃', gauche: 5, taille: 90, duree: 19, delai: 0 },
  { emoji: '🍃', gauche: 17, taille: 90, duree: 24, delai: -6 },
  { emoji: '🌿', gauche: 28, taille: 90, duree: 21, delai: -13 },
  { emoji: '🍵', gauche: 41, taille: 90, duree: 26, delai: -3 },
  { emoji: '⭐', gauche: 53, taille: 90, duree: 18, delai: -9 },
  { emoji: '🍃', gauche: 65, taille: 90, duree: 23, delai: -16 },
  { emoji: '🎁', gauche: 76, taille: 90, duree: 20, delai: -11 },
  { emoji: '🌿', gauche: 87, taille: 90, duree: 25, delai: -5 },
  { emoji: '🍃', gauche: 96, taille: 90, duree: 22, delai: -18 },
];

// Flèche décorative qui relie chaque consigne à l'élément correspondant.
function Fleche({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 76 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M72 5 C52 2 28 5 13 19" />
      <path d="M13 19 L26 14" />
      <path d="M13 19 L16 5" />
    </svg>
  );
}

export default function Home() {
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');
  const lienParticiper = user ? '/entrer-code' : '/connexion';

  const consignes = [
    'Je récupère le code à 10 caractères sur mon ticket de caisse',
    'Je saisis mon code et je lance le tirage des boules',
    'Je participe au grand tirage de clôture',
  ];

  const lots = [
    { emoji: '🍵', titre: 'Infuseur à thé', description: 'Un infuseur élégant pour vos moments de dégustation.' },
    { emoji: '🌿', titre: 'Boîte de thé détox', description: 'Un mélange bio détox ou une infusion de 100g.' },
    { emoji: '⭐', titre: 'Thé signature', description: 'Une boîte de 100g de notre mélange signature exclusif.' },
    { emoji: '🎁', titre: 'Coffret découverte', description: 'Un assortiment de nos meilleurs thés (valeur 39€ ou 69€).' },
    { emoji: '👑', titre: 'Grand tirage au sort', description: 'Un an de thé offert, d\'une valeur de 360€ !' },
  ];

  const etapes = [
    { numero: 1, titre: 'Achetez', texte: 'Effectuez un achat de 49€ ou plus en boutique Thé Tip Top.' },
    { numero: 2, titre: 'Récupérez votre code', texte: 'Un code unique à 10 caractères figure sur votre ticket de caisse.' },
    { numero: 3, titre: 'Lancez le tirage', texte: 'Saisissez votre code : les boules se mélangent et révèlent votre lot.' },
    { numero: 4, titre: 'Visez le gros lot', texte: `Inscrivez-vous au grand tirage organisé à la clôture, le ${dateClotureLisible()}.` },
  ];

  return (
    <div className="home">
      {/* ===== ACCUEIL DU JEU ===== */}
      <section className="jeu-hero">
        <div className="jeu-decor" aria-hidden="true">
          <span className="jeu-halo" />

          {DECOR.map((element, index) => (
            <span
              key={`decor-${index}`}
              className="jeu-decor-item"
              style={{
                left: `${element.gauche}%`,
                '--taille': `${element.taille}px`,
                animationDuration: `${element.duree}s`,
                animationDelay: `${element.delai}s`,
              }}
            >
              {element.emoji}
            </span>
          ))}
        </div>

        <div className="jeu-hero-inner">
          <div className="jeu-hero-entete">
            <h1 className="jeu-titre">
              {TITRE.split(' ').map((mot, index) => (
                <span
                  key={`${mot}-${index}`}
                  className="jeu-titre-mot"
                  style={{ animationDelay: `${index * 0.07}s` }}
                >
                  {mot}
                </span>
              ))}
            </h1>

            <div className="jeu-badge-gagnant" aria-label="100% gagnant">
              <div className="jeu-badge-gagnant-etoiles" aria-hidden="true" />
              <div className="jeu-badge-gagnant-cercle">
                <span className="jeu-badge-pourcent">100%</span>
                <span className="jeu-badge-texte">GAGNANT</span>
              </div>
            </div>
          </div>

          <p className="jeu-marque">
            <span className="jeu-marque-logo" aria-hidden="true">🍵</span>
            <span className="jeu-marque-nom">Thé Tip Top</span>
            <span className="jeu-marque-note">Ouverture de la 10ᵉ boutique — Nice</span>
          </p>

          <div className="jeu-scene">
            <div className="jeu-scene-machine">
              <TirageBoules connecte={Boolean(user)} />
            </div>

            <div className="jeu-scene-infos">
              <a className="jeu-btn-comment" href="#comment-jouer">
                Comment jouer ?
                <Fleche className="jeu-fleche-comment" />
              </a>

              <ol className="jeu-consignes">
                {consignes.map((consigne, index) => (
                  <li key={consigne} className="jeu-consigne">
                    <Fleche className="jeu-consigne-fleche" />
                    <span className="jeu-consigne-num">{index + 1}</span>
                    <span className="jeu-consigne-texte">{consigne}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="jeu-tirage">
            <span className="jeu-tirage-pouce" aria-hidden="true">🎱</span>
            <div className="jeu-tirage-contenu">
              <h2>Grand tirage de clôture</h2>
              <p>
                Le jeu-concours dure <strong>{DUREE_JOURS} jours</strong>. À sa clôture, le{' '}
                <strong>{dateClotureLisible()}</strong>, un tirage au sort désignera le
                gagnant du gros lot : <strong>un an de thé offert, d'une valeur de 360 €</strong>.
              </p>
              <p className="jeu-tirage-note">
                Chaque code saisi vous inscrit automatiquement au grand tirage. Il vous
                reste {joursAvantCloture()} jours pour tenter votre chance.
              </p>
              <div className="jeu-tirage-actions">
                <Link to={lienParticiper} className="btn btn-gold">Je participe</Link>
                <Link to="/reglement" className="jeu-lien-discret">Voir le règlement</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ===== COMMENT PARTICIPER ===== */}
      <section className="etapes" id="comment-jouer">
        <h2>Comment jouer ?</h2>
        <p className="section-subtitle">
          Quatre étapes suffisent pour découvrir votre lot :
          <strong> 100 % des tickets sont gagnants.</strong>
        </p>
        <div className="etapes-grid">
          {etapes.map((etape) => (
            <article key={etape.numero} className="etape-card">
              <div className="etape-numero">{etape.numero}</div>
              <h3>{etape.titre}</h3>
              <p>{etape.texte}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== LOTS ===== */}
      <section className="lots-apercu">
        <h2>Les lots à gagner</h2>
        <p className="section-subtitle">
          500 000 tickets gagnants sont mis en jeu. Voici ce que vous pouvez remporter :
        </p>
        <div className="lots-grid">
          {lots.map((lot) => (
            <article key={lot.titre} className="lot-card">
              <div className="lot-emoji">{lot.emoji}</div>
              <h3>{lot.titre}</h3>
              <p>{lot.description}</p>
            </article>
          ))}
        </div>
        <div className="lots-cta">
          <Link to="/lots" className="btn btn-primary">Voir le détail des lots</Link>
        </div>
      </section>

      {/* ===== BANDEAU CTA ===== */}
      <section className="cta-band">
        <h2>Prêt à tenter votre chance ?</h2>
        <p>Saisissez le code de votre ticket de caisse et découvrez votre gain en quelques secondes !</p>
        <Link to={user ? lienParticiper : '/inscription'} className="btn btn-gold btn-participer">
          Je participe maintenant
        </Link>
      </section>
    </div>
  );
}
