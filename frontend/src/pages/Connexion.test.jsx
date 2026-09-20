import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Connexion from './Connexion.jsx';
import { renderPage } from '../test/renderPage.jsx';

function renderConnexion() {
  return renderPage(<Connexion />, {
    route: '/connexion',
    path: '/connexion',
    routes: [
      { path: '/', element: <p>Page accueil</p> },
      { path: '/profil', element: <p>Page profil</p> },
    ],
  });
}

function mockGoogleSdk() {
  const initialize = vi.fn();
  const renderButton = vi.fn();
  window.google = {
    accounts: {
      id: { initialize, renderButton },
    },
  };
  return { initialize, renderButton };
}

describe('Connexion', () => {
  it('affiche le formulaire et le lien vers l’inscription', () => {
    renderConnexion();

    expect(screen.getByRole('heading', { name: 'Connexion' })).toBeInTheDocument();
    expect(screen.getByLabelText(/adresse e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /créez votre compte gratuitement/i }),
    ).toHaveAttribute('href', '/inscription');
  });

  it('affiche une erreur si les identifiants sont refusés', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Identifiants incorrects' }),
    });

    renderConnexion();
    await user.type(screen.getByLabelText(/adresse e-mail/i), 'jean@example.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'Password1!');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Identifiants incorrects',
    );
  });

  it('enregistre le token et redirige vers l’accueil', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'jwt-test',
        role: 'CLIENT',
        user: { email: 'jean@example.com' },
      }),
    });

    renderConnexion();
    await user.type(screen.getByLabelText(/adresse e-mail/i), 'jean@example.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'Password1!');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(screen.getByText('Page accueil')).toBeInTheDocument();
    });
    expect(sessionStorage.getItem('token')).toBe('jwt-test');
  });
});

describe('Connexion via Google', () => {
  async function renderAvecGoogle() {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'google-client-test');
    vi.resetModules();
    const { default: ConnexionGoogle } = await import('./Connexion.jsx');
    const { renderPage: render } = await import('../test/renderPage.jsx');
    const google = mockGoogleSdk();

    render(<ConnexionGoogle />, {
      route: '/connexion',
      path: '/connexion',
      routes: [
        { path: '/', element: <p>Page accueil</p> },
        { path: '/profil', element: <p>Page profil</p> },
      ],
    });

    const script = document.querySelector('script[src*="accounts.google.com"]');
    script?.dispatchEvent(new Event('load'));

    return google;
  }

  it('enregistre le token Google et redirige vers l’accueil', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'jwt-google',
        role: 'CLIENT',
        user: { email: 'jean.google@example.com' },
      }),
    });

    const { initialize } = await renderAvecGoogle();
    await waitFor(() => expect(initialize).toHaveBeenCalled());

    await act(async () => {
      await initialize.mock.calls[0][0].callback({ credential: 'google-jwt' });
    });

    await waitFor(() => {
      expect(screen.getByText('Page accueil')).toBeInTheDocument();
    });
    expect(sessionStorage.getItem('token')).toBe('jwt-google');
    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/google',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ credential: 'google-jwt' }),
      }),
    );
  });

  it('affiche une erreur si Google est refusé', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Connexion Google échouée' }),
    });

    const { initialize } = await renderAvecGoogle();
    await waitFor(() => expect(initialize).toHaveBeenCalled());

    await act(async () => {
      await initialize.mock.calls[0][0].callback({ credential: 'google-jwt' });
    });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Connexion Google échouée',
    );
  });
});
