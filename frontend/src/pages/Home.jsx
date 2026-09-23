import { Link } from 'react-router-dom';
import TirageBoules from '../components/TirageBoules.jsx';
import NewsletterForm from '../components/NewsletterForm.jsx';
import { DUREE_JOURS, dateClotureLisible, joursAvantCloture } from '../config/jeu.js';
import { suivreCta } from '../utils/analytics';
import '../styles/Home.css';

const TITRE = ' Jeu concours lancez le tirage et tentez de remporter un cadeau';
// Éléments qui remontent en fond du bandeau (position en %, durée en secondes).
const DECOR = [
  { emoji: '🍃', gauche: 5, taille: 90, duree: 19, delai: 0 },
  { emoji: '🍵', gauche: 17, taille: 90, duree: 24, delai: -6 },
  { emoji: '🎁', gauche: 28, taille: 90, duree: 21, delai: -13 },
  { emoji: '🍵', gauche: 41, taille: 90, duree: 26, delai: -3 },
  { emoji: '🎁', gauche: 53, taille: 90, duree: 18, delai: -9 },
  { emoji: '🍃', gauche: 65, taille: 90, duree: 23, delai: -16 },
  { emoji: '🎁', gauche: 76, taille: 90, duree: 20, delai: -11 },
  { emoji: '🍵', gauche: 87, taille: 90, duree: 25, delai: -5 },
  { emoji: '🍃', gauche: 96, taille: 90, duree: 22, delai: -18 },
];

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

          <div className="jeu-colonne jeu-colonne-gauche">
            <div className="jeu-hero-entete">
              <div className="jeu-badge-gagnant" aria-label="Jeu concours 100% gagnant">
                <div className="jeu-badge-gagnant-etoiles" aria-hidden="true" />
                <div className="jeu-badge-gagnant-cercle">
                  <span className="jeu-badge-titre">Jeu concours</span>
                  <span className="jeu-badge-pourcent">100%</span>
                  <span className="jeu-badge-texte">Gagnant</span>
                </div>
              </div>
            </div>
          </div>

          <div className="jeu-colonne jeu-colonne-centre">
            <TirageBoules />
          </div>

          <div className="jeu-colonne jeu-colonne-droite">
            <div className="jeu-scene-infos">
              <ol className="jeu-consignes">
                {consignes.map((consigne, index) => (
                  <li key={consigne} className="jeu-consigne">
                    <span className="jeu-consigne-num">{index + 1}</span>
                    <span className="jeu-consigne-texte">{consigne}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>
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
          <Link
            to="/lots"
            className="btn btn-primary"
            onClick={() => suivreCta('voir-lots')}
          >
            Voir le détail des lots
          </Link>
        </div>
      </section>
    </div>
  );
}
