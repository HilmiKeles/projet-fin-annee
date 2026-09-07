// src/components/Layout.jsx
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import CookieBanner from './CookieBanner.jsx';

const PAGES_NOINDEX = [
  '/admin',
  '/employe',
  '/profil',
  '/resultat',
  '/entrer-code',
  '/connexion',
  '/inscription',
  '/signaler-probleme',
];

function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const privee = PAGES_NOINDEX.some(
      (chemin) => pathname === chemin || pathname.startsWith(`${chemin}/`)
    );
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', privee ? 'noindex, nofollow' : 'index, follow');
  }, [pathname]);

  return (
    <>
      <Header />
      <main style={{ minHeight: '60vh' }}>
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}

export default Layout;