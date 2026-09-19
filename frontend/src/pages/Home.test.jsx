import { screen } from '@testing-library/react';
import Home from './Home.jsx';
import { renderPage } from '../test/renderPage.jsx';

describe('Home', () => {
  it('présente le jeu-concours et le badge 100% gagnant', () => {
    renderPage(<Home />);

    const titre = screen.getByRole('heading', { level: 1 });
    expect(titre).toHaveTextContent(/Lancez/);
    expect(titre).toHaveTextContent(/cadeau/);
    expect(screen.getByLabelText('100% gagnant')).toBeInTheDocument();
    expect(screen.getAllByText(/thé tip top/i).length).toBeGreaterThan(0);
  });

  it('liste les lots principaux', () => {
    renderPage(<Home />);

    expect(screen.getByRole('heading', { name: 'Infuseur à thé' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Boîte de thé détox' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Thé signature' })).toBeInTheDocument();
  });

  it('envoie un visiteur non connecté vers la connexion', () => {
    renderPage(<Home />);

    expect(screen.getByRole('link', { name: 'Je participe' })).toHaveAttribute(
      'href',
      '/connexion',
    );
    expect(
      screen.getByRole('link', { name: 'Je participe maintenant' }),
    ).toHaveAttribute('href', '/inscription');
  });

  it('envoie un utilisateur connecté vers la saisie de code', () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 'user-1', role: 'CLIENT' }));

    renderPage(<Home />);

    expect(screen.getByRole('link', { name: 'Je participe' })).toHaveAttribute(
      'href',
      '/entrer-code',
    );
  });
});
