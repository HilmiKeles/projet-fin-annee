import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');

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
    { numero: 3, titre: 'Participez en ligne', texte: 'Créez votre compte et saisissez votre code sur notre site.' },
    { numero: 4, titre: 'Gagnez !', texte: '100% des tickets sont gagnants : découvrez immédiatement votre lot.' },
  ];

  return (
    <main className="home">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <h1>Grand Jeu-Concours<br /><span className="hero-highlight">Thé Tip Top</span></h1>
            <p className="hero-subtitle">
              Pour fêter l'ouverture de notre 10ème boutique à Nice,
              tentez de remporter de nombreux lots !
              <strong> 100% des tickets sont gagnants.</strong>
            </p>
            <div className="hero-actions">
              <Link to={user ? "/mon-compte" : "/connexion"} className="btn btn-primary btn-participer">
                Participer au jeu
              </Link>
              <Link to="/lots" className="btn btn-secondary">
                Découvrir les lots
              </Link>
            </div>
          </div>
          <div className="hero-image" aria-hidden="true">🍵</div>
        </div>
      </section>

      {/* ===== COMMENT PARTICIPER ===== */}
      <section className="etapes">
        <h2>Comment participer ?</h2>
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
        <Link to={user ? "/mon-compte" : "/inscription"} className="btn btn-gold btn-participer">
          Je participe maintenant
        </Link>
      </section>
    </main>
  );
}