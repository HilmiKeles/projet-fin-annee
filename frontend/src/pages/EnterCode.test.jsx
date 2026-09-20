import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import EnterCode from './EnterCode.jsx';
import { renderPage } from '../test/renderPage.jsx';

vi.mock('../utils/tirage.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    dureeAnimationTirage: () => 40,
  };
});

function renderEnterCode() {
  return renderPage(<EnterCode />, {
    route: '/entrer-code',
    path: '/entrer-code',
    routes: [
      { path: '/resultat', element: <p>Page résultat</p> },
    ],
  });
}

describe('EnterCode', () => {
  it('affiche le champ de saisie du code', () => {
    renderEnterCode();

    expect(
      screen.getByRole('heading', { name: /participez au jeu/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Votre code')).toBeInTheDocument();
    expect(screen.getByText('0/10')).toBeInTheDocument();
    expect(screen.getByText(/pas encore inscrit/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /créez votre compte/i }),
    ).toHaveAttribute('href', '/inscription');
  });

  it('n’invite pas à s’inscrire si l’utilisateur est connecté', () => {
    sessionStorage.setItem('token', 'jwt-test');
    renderEnterCode();

    expect(screen.queryByText(/pas encore inscrit/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /votre profil/i }),
    ).toHaveAttribute('href', '/profil');
  });

  it('normalise le code en majuscules alphanumériques', async () => {
    const user = userEvent.setup();
    renderEnterCode();

    await user.type(screen.getByLabelText('Votre code'), 'ab c-12');

    expect(screen.getByLabelText('Votre code')).toHaveValue('ABC12');
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });

  it('refuse un code trop court', async () => {
    const user = userEvent.setup();
    renderEnterCode();

    await user.type(screen.getByLabelText('Votre code'), 'ABC123');
    await user.click(screen.getByRole('button', { name: 'Valider mon code' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Le code doit contenir exactement 10 caractères',
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('redirige vers le résultat si le ticket est valide', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('token', 'jwt-test');
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ prize: 'infuseur' }),
    });

    renderEnterCode();
    await user.type(screen.getByLabelText('Votre code'), 'ABC123XYZ9');
    await user.click(screen.getByRole('button', { name: 'Valider mon code' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      /mélange des boules/i,
    );
    await waitFor(() => {
      expect(screen.getByText('Page résultat')).toBeInTheDocument();
    });
    expect(fetch).toHaveBeenCalledWith(
      '/api/tickets/validate',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ code: 'ABC123XYZ9' }),
      }),
    );
  });

  it('affiche l’erreur renvoyée par l’API', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('token', 'jwt-test');
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Ticket déjà utilisé' }),
    });

    renderEnterCode();
    await user.type(screen.getByLabelText('Votre code'), 'ABC123XYZ9');
    await user.click(screen.getByRole('button', { name: 'Valider mon code' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ticket déjà utilisé',
    );
  });

  it('affiche une erreur si le serveur est injoignable', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('token', 'jwt-test');
    fetch.mockRejectedValueOnce(new Error('offline'));

    renderEnterCode();
    await user.type(screen.getByLabelText('Votre code'), 'ABC123XYZ9');
    await user.click(screen.getByRole('button', { name: 'Valider mon code' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Erreur de connexion au serveur. Réessayez.',
    );
  });
});
