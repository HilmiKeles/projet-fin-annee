import { screen, waitFor } from '@testing-library/react';
import Profil from './Profil.jsx';
import { renderPage } from '../test/renderPage.jsx';

describe('Profil', () => {
  it('affiche un chargement puis le profil', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean@example.com',
        },
        participations: [],
      }),
    });

    renderPage(<Profil />, { route: '/profil', path: '/profil' });

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
  });

  it('demande de se connecter si l’API refuse l’accès', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Non authentifié' }),
    });

    renderPage(<Profil />, { route: '/profil', path: '/profil' });

    expect(
      await screen.findByText('Vous devez être connecté pour voir cette page.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Me connecter' })).toHaveAttribute(
      'href',
      '/connexion',
    );
  });

  it('liste les participations et leur statut', async () => {
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

    renderPage(<Profil />, { route: '/profil', path: '/profil' });

    expect(await screen.findByRole('heading', { name: /mes participations/i })).toHaveTextContent('2');
    expect(screen.getByText('Infuseur à thé')).toBeInTheDocument();
    expect(screen.getByText('Code : ABC123XYZ9')).toBeInTheDocument();
    expect(screen.getByText('À retirer en boutique')).toBeInTheDocument();
    expect(screen.getByText('✓ Lot remis')).toBeInTheDocument();
  });

  it('affiche une erreur réseau', async () => {
    fetch.mockRejectedValueOnce(new Error('offline'));

    renderPage(<Profil />, { route: '/profil', path: '/profil' });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Erreur au chargement du profil.',
      );
    });
  });
});
