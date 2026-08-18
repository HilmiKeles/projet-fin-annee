import { Link } from 'react-router-dom';
import '../styles/Lots.css';

export default function Lots() {
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');

  const lots = [
    {
      emoji: '🍵',
      titre: 'Infuseur à thé',
      pourcentage: 60,
      quantite: '300 000 gagnants',
      description:
        'Un infuseur à thé design et pratique, idéal pour préparer vos thés en vrac ' +
        'et profiter pleinement des saveurs de nos mélanges.',
    },
    {
      emoji: '🌿',
      titre: 'Boîte de 100g de thé détox ou infusion',
      pourcentage: 20,
      quantite: '100 000 gagnants',
      description:
        'Une boîte de 100g de notre thé détox bio ou d\'une de nos infusions, ' +
        'pour un moment de bien-être et de légèreté.',
    },
    {
      emoji: '⭐',
      titre: 'Boîte de 100g de thé signature',
      pourcentage: 10,
      quantite: '50 000 gagnants',
      description:
        'Notre mélange signature exclusif, élaboré par nos maîtres de thé. ' +
        'Une boîte de 100g d\'un thé d\'exception, bio et fait main.',
    },
    {
      emoji: '🎁',
      titre: 'Coffret découverte — 39€',
      pourcentage: 6,
      quantite: '30 000 gagnants',
      description:
        'Un coffret découverte d\'une valeur de 39€ comprenant une sélection ' +
        'de nos meilleurs thés et infusions.',
    },
    {
      emoji: '💝',
      titre: 'Coffret de luxe — 69€',
      pourcentage: 4,
      quantite: '20 000 gagnants',
      description:
        'Le coffret de luxe prestige d\'une valeur de 69€ : notre sélection ' +
        'la plus raffinée de thés rares et d\'accessoires.',
    },
  ];

  return (
    <main className="lots-page">
      {/* ===== EN-TÊTE ===== */}
      <section className="lots-header">
        <h1>Les lots à gagner</h1>
        <p className="lots-intro">
          Pour célébrer l'ouverture de notre 10ème boutique à Nice, nous mettons en jeu
          <strong> 500 000 tickets 100% gagnants</strong> ! Chaque ticket de caisse ou facture
          de 49€ ou plus vous donne droit à un code unique. Saisissez-le sur le site et
          découvrez immédiatement votre lot.
        </p>
      </section>

      {/* ===== GRAND TIRAGE ===== */}
      <section className="grand-tirage">
        <div className="grand-tirage-card">
          <div className="grand-tirage-emoji">👑</div>
          <div>
            <h2>Grand tirage au sort : un an de thé offert !</h2>
            <p>
              À l'issue du jeu-concours, <strong>tous les participants</strong> seront
              automatiquement inscrits à un grand tirage au sort. L'heureux élu remportera
              <strong> un an de thé d'une valeur de 360€</strong> !
            </p>
          </div>
        </div>
      </section>

      {/* ===== LISTE DES LOTS ===== */}
      <section className="lots-liste">
        <h2>Répartition des gains</h2>
        <div className="lots-cards">
          {lots.map((lot) => (
            <article key={lot.titre} className="lot-detail-card">
              <div className="lot-detail-emoji">{lot.emoji}</div>
              <div className="lot-detail-content">
                <h3>{lot.titre}</h3>
                <p>{lot.description}</p>
                <span className="lot-quantite">{lot.quantite}</span>
              </div>
              <div className="lot-pourcentage">
                <span className="pourcentage-valeur">{lot.pourcentage}%</span>
                <span className="pourcentage-label">des tickets</span>
                <div className="pourcentage-barre">
                  <div
                    className="pourcentage-progression"
                    style={{ width: `${lot.pourcentage}%` }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== INFOS PRATIQUES ===== */}
      <section className="lots-infos">
        <h2>Informations pratiques</h2>
        <div className="infos-grid">
          <article className="info-card">
            <span className="info-emoji">🗓️</span>
            <h3>Durée du jeu</h3>
            <p>
              Le jeu-concours dure 30 jours. Vous disposez ensuite de 30 jours
              supplémentaires après la clôture pour saisir votre code en ligne.
            </p>
          </article>
          <article className="info-card">
            <span className="info-emoji">🎫</span>
            <h3>Comment obtenir un code ?</h3>
            <p>
              Tout achat de 49€ ou plus en boutique vous donne droit à un code
              unique à 10 caractères, imprimé sur votre ticket de caisse ou facture.
            </p>
          </article>
          <article className="info-card">
            <span className="info-emoji">🏪</span>
            <h3>Retrait des lots</h3>
            <p>
              Les lots sont à retirer en boutique Thé Tip Top ou à commander
              en ligne depuis votre espace personnel.
            </p>
          </article>
          <article className="info-card">
            <span className="info-emoji">📜</span>
            <h3>Règlement du jeu</h3>
            <p>
              Consultez le <Link to="/reglement">règlement complet du jeu-concours</Link> pour
              connaître toutes les modalités de participation.
            </p>
          </article>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="lots-cta">
        <h2>Vous avez un code ?</h2>
        <p>Ne perdez pas une seconde, votre lot vous attend !</p>
        <Link to={user ? "/mon-compte" : "/connexion"} className="btn btn-gold">
          Saisir mon code
        </Link>
      </section>
    </main>
  );
}