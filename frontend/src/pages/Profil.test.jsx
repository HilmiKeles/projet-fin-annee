import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profil from './Profil.jsx';
import { renderPage } from '../test/renderPage.jsx';

const profilVide = {
  user: {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean@example.com',
  },
  participations: [],
};

function renderProfil(routes = []) {
  return renderPage(<Profil />, {
    route: '/profil',
    path: '/profil',
    routes,
  });
}

describe('Profil', () => {
  it('affiche un chargement puis le profil', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => profilVide,
    });

    renderProfil();

    expect(screen.getByText('Chargement de votre compte...')).toBeInTheDocument();

    const infos = await screen.findByLabelText('Informations personnelles');
    expect(infos).toHaveTextContent('Jean');
    expect(infos).toHaveTextContent('Dupont');
    expect(infos).toHaveTextContent('jean@example.com');
    expect(
      screen.getByText("Vous n'avez pas encore participé au jeu."),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /jouer maintenant/i })).toHaveAttribute(
      'href',
      '/entrer-code',
    );
    expect(
      screen.getByRole('heading', { name: 'Modifier mon mot de passe' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Supprimer mon compte' }),
    ).toBeInTheDocument();
  });

  it('demande de se connecter si l’API refuse l’accès', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Non authentifié' }),
    });

    renderProfil();

    expect(
      await screen.findByText('Vous devez être connecté pour voir cette page.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Me connecter' })).toHaveAttribute(
      'href',
      '/connexion',
    );
  });

  it('liste les gains et leur statut', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean@example.com',
        },
        participations: [
          {
            id: 'gain-1',
            prize: 'infuseur',
            code: 'ABC123XYZ9',
            claimed: false,
            playedAt: '2026-09-01T10:00:00.000Z',
          },
          {
            id: 'gain-2',
            prize: 'detox',
            code: 'DET0X12345',
            claimed: true,
            playedAt: '2026-09-02T10:00:00.000Z',
          },
        ],
      }),
    });

    renderProfil();

    expect(await screen.findByRole('heading', { name: /mes gains/i })).toHaveTextContent(
      '2',
    );
    expect(screen.getByText('Infuseur à thé')).toBeInTheDocument();
    expect(screen.getByText('Code : ABC123XYZ9')).toBeInTheDocument();
    expect(screen.getByText('À retirer en boutique')).toBeInTheDocument();
    expect(screen.getByText('✓ Lot remis')).toBeInTheDocument();
    expect(screen.getByText(/1 lot à retirer en boutique/i)).toBeInTheDocument();
  });

  it('affiche une erreur réseau', async () => {
    fetch.mockRejectedValueOnce(new Error('offline'));

    renderProfil();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Erreur au chargement du profil.',
      );
    });
  });

  it('refuse un nouveau mot de passe trop faible', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => profilVide,
    });

    renderProfil();
    await screen.findByLabelText('Informations personnelles');

    await user.type(screen.getByLabelText('Mot de passe actuel'), 'Password1!');
    await user.type(screen.getByLabelText('Nouveau mot de passe'), 'faible');
    await user.type(
      screen.getByLabelText('Confirmer le nouveau mot de passe'),
      'faible',
    );
    await user.click(
      screen.getByRole('button', { name: 'Enregistrer le mot de passe' }),
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Le mot de passe doit contenir au moins 8 caractères.',
    );
    expect(fetch.mock.calls.filter(([url]) => String(url).includes('/password'))).toHaveLength(
      0,
    );
  });

  it('met à jour le mot de passe', async () => {
    const user = userEvent.setup();
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => profilVide,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Mot de passe mis à jour.' }),
      });

    renderProfil();
    await screen.findByLabelText('Informations personnelles');

    await user.type(screen.getByLabelText('Mot de passe actuel'), 'Password1!');
    await user.type(screen.getByLabelText('Nouveau mot de passe'), 'NewPass1!');
    await user.type(
      screen.getByLabelText('Confirmer le nouveau mot de passe'),
      'NewPass1!',
    );
    await user.click(
      screen.getByRole('button', { name: 'Enregistrer le mot de passe' }),
    );

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Mot de passe mis à jour.',
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/me/password'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword: 'Password1!',
          newPassword: 'NewPass1!',
        }),
      }),
    );
  });

  it('supprime le compte et redirige vers l’accueil', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('token', 'jwt-test');
    sessionStorage.setItem('user', JSON.stringify({ email: 'jean@example.com' }));

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => profilVide,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Compte supprimé.' }),
      });

    renderProfil([{ path: '/', element: <p>Page accueil</p> }]);
    await screen.findByLabelText('Informations personnelles');

    await user.type(
      screen.getByLabelText('Mot de passe de confirmation'),
      'Password1!',
    );
    await user.click(
      screen.getByRole('checkbox', {
        name: /je confirme vouloir supprimer définitivement mon compte/i,
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Supprimer mon compte' }));

    expect(await screen.findByText('Page accueil')).toBeInTheDocument();
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/me'),
      expect.objectContaining({
        method: 'DELETE',
        body: JSON.stringify({ password: 'Password1!' }),
      }),
    );
  });
});
