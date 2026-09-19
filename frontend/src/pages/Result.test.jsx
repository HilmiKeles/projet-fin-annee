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
      screen.getByRole('heading', { name: 'Un infuseur à thé !' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Voir mon historique' }),
    ).toHaveAttribute('href', '/mon-compte');
  });

  it('redirige vers la saisie si aucun gain n’est fourni', async () => {
    renderPage(<Result />, {
      route: '/resultat',
      path: '/resultat',
      routes: [{ path: '/saisie-code', element: <p>Saisie du code</p> }],
    });

    await waitFor(() => {
      expect(screen.getByText('Saisie du code')).toBeInTheDocument();
    });
  });
});
