import { screen } from '@testing-library/react';
import Lots from './Lots.jsx';
import { renderPage } from '../test/renderPage.jsx';

describe('Lots', () => {
  it('présente les 500 000 tickets et le grand tirage', () => {
    renderPage(<Lots />);

    expect(
      screen.getByRole('heading', { name: 'Les lots à gagner' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/500 000 tickets 100% gagnants/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /grand tirage au sort : un an de thé offert/i,
      }),
    ).toBeInTheDocument();
  });

  it('affiche la répartition officielle des lots', () => {
    renderPage(<Lots />);

    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('6%')).toBeInTheDocument();
    expect(screen.getByText('4%')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Infuseur à thé' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /règlement complet du jeu-concours/i }),
    ).toHaveAttribute('href', '/reglement');
  });

  it('envoie un visiteur non connecté vers la connexion pour saisir un code', () => {
    renderPage(<Lots />);

    expect(screen.getByRole('link', { name: 'Saisir mon code' })).toHaveAttribute(
      'href',
      '/connexion',
    );
  });

  it('envoie un visiteur déjà connecté vers son espace', () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 'user-1', role: 'CLIENT' }));

    renderPage(<Lots />);

    expect(screen.getByRole('link', { name: 'Saisir mon code' })).toHaveAttribute(
      'href',
      '/entrer-code',
    );
  });
});
