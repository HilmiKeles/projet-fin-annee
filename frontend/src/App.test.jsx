import { render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import App from './App.jsx';

vi.mock('./components/Layout.jsx', async () => {
  const { Outlet } = await import('react-router-dom');
  return {
    default: function LayoutTest() {
      return <Outlet />;
    },
  };
});

vi.mock('./components/ScrollToTop.jsx', () => ({
  default: () => null,
}));

function visiter(chemin) {
  window.history.pushState({}, '', chemin);
  return render(<App />);
}

afterEach(() => {
  window.history.pushState({}, '', '/');
});

describe('App — routage', () => {
  it('affiche l’espace administrateur sur /admin', () => {
    visiter('/admin');

    expect(
      screen.getByRole('heading', { name: 'Administration' }),
    ).toBeInTheDocument();
  });

  it('affiche la page contact sur /contact', () => {
    visiter('/contact');

    expect(screen.getByRole('heading', { name: 'Nous contacter' })).toBeInTheDocument();
  });

  it('affiche le signalement sur /signaler-probleme', () => {
    visiter('/signaler-probleme');

    expect(
      screen.getByRole('heading', { name: 'Signaler un problème' }),
    ).toBeInTheDocument();
  });

  it('affiche la 404 pour une URL inconnue', () => {
    visiter('/page-inconnue');

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /infusée trop longtemps/i }),
    ).toBeInTheDocument();
  });
});
