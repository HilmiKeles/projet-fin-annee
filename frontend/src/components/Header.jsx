import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid rgba(168,195,160,0.3)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '72px'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="18" fill="#2E5A3C" />
            <path d="M18 8 C14 12 10 16 12 22 C14 26 18 28 18 28 C18 28 22 26 24 22 C26 16 22 12 18 8Z" fill="#A8C3A0" />
          </svg>
          <span style={{ fontFamily: 'var(--font-titre)', fontSize: 22, color: 'var(--vert-the)', fontWeight: 700 }}>
            Thé Tip Top
          </span>
        </Link>

        {/* Menu burger mobile */}
        <button
          onClick={() => setMenuOuvert(!menuOuvert)}
          className="burger"
          aria-label="Menu"
          style={{ display: 'none', background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}
        >
          ☰
        </button>

        <nav className={menuOuvert ? 'nav ouvert' : 'nav'} style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link to="/saisie-code">🎟️ Participer</Link>
          <Link to="/profil">Mon compte</Link>
          <Link to="/connexion">
            <button className="btn-primary" style={{ padding: '10px 20px' }}>Connexion</button>
          </Link>
        </nav>
      </div>
    </header>
  );
}