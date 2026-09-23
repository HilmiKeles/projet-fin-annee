import { screen } from '@testing-library/react';
import Home from './Home.jsx';
import { renderPage } from '../test/renderPage.jsx';

describe('Home', () => {
  it('présente le jeu-concours et le badge 100% gagnant', () => {
    renderPage(<Home />);

    const titre = screen.getByRole('heading', { level: 1 });
    expect(titre).toHaveTextContent(/lancez/i);
    expect(titre).toHaveTextContent(/cadeau/i);
    expect(screen.getByLabelText(/100% gagnant/i)).toBeInTheDocument();
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

    expect(
      screen.getByRole('link', { name: 'Connectez-vous pour jouer' }),
    ).toHaveAttribute('href', '/connexion');
  });

  it('permet à un utilisateur connecté de lancer le tirage', () => {
    sessionStorage.setItem('token', 'jwt-test');
    sessionStorage.setItem('user', JSON.stringify({ id: 'user-1', role: 'CLIENT' }));

    renderPage(<Home />);

    expect(
      screen.getByRole('button', { name: 'Lancer le tirage' }),
    ).toBeInTheDocument();
  });
});
