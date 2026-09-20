import { screen, waitFor } from '@testing-library/react';
import Result from './Result.jsx';
import { renderPage } from '../test/renderPage.jsx';

describe('Result', () => {
  it('affiche le lot gagné', () => {
    renderPage(<Result />, {
      route: { pathname: '/resultat', state: { gain: 'infuseur' } },
      path: '/resultat',
    });

    expect(screen.getByRole('heading', { name: 'Félicitations !' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Infuseur à thé' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Voir mon historique' }),
    ).toHaveAttribute('href', '/profil');
  });

  it('redirige vers la saisie si aucun gain n’est fourni', async () => {
    renderPage(<Result />, {
      route: '/resultat',
      path: '/resultat',
      routes: [{ path: '/entrer-code', element: <p>Saisie du code</p> }],
    });

    await waitFor(() => {
      expect(screen.getByText('Saisie du code')).toBeInTheDocument();
    });
  });
});
