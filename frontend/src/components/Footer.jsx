import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--vert-the)', color: 'white', padding: '48px 0 24px' }}>
      <div className="container" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32
      }}>
        <div>
          <h4 style={{ color: 'white' }}>Thé Tip Top</h4>
          <p style={{ fontSize: 14, opacity: 0.8 }}>12 rue de la Paix, 06000 Nice</p>
        </div>
        <div>
          <h4 style={{ color: 'white' }}>Navigation</h4>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: 8 }}>Accueil</Link>
          <Link to="/saisie-code" style={{ color: 'rgba(255,255,255,0.8)', display: 'block' }}>Participer</Link>
        </div>
        <div>
          <h4 style={{ color: 'white' }}>Légal</h4>
          <Link to="/cgu" style={{ color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: 8 }}>CGU & Règlement</Link>
          <Link to="/cgu#confidentialite" style={{ color: 'rgba(255,255,255,0.8)', display: 'block' }}>Politique de confidentialité</Link>
        </div>
      </div>
      <div className="container" style={{ marginTop: 32, textAlign: 'center' }}>
        <p style={{ fontSize: 13, opacity: 0.7 }}>© 2026 Thé Tip Top — Tous droits réservés</p>
        <p style={{
          fontSize: 12, fontStyle: 'italic', marginTop: 8, padding: '6px 14px',
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, display: 'inline-block'
        }}>
          ⚠️ Projet étudiant fictif — aucun achat, gain ou réservation réelle possible
        </p>
      </div>
    </footer>
  );
}