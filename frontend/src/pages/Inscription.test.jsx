import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Inscription from './Inscription.jsx';
import { renderPage } from '../test/renderPage.jsx';

async function remplirFormulaire(
  user,
  { motDePasse = 'Password1!', confirmation, newsletter = false } = {},
) {
  await user.type(screen.getByLabelText('Prénom'), 'Jean');
  await user.type(screen.getByLabelText('Nom'), 'Dupont');
  await user.type(screen.getByLabelText(/adresse e-mail/i), 'jean@example.com');
  await user.type(screen.getByLabelText('Mot de passe', { exact: true }), motDePasse);
  await user.type(
    screen.getByLabelText(/confirmation du mot de passe/i),
    confirmation ?? motDePasse,
  );
  await user.click(screen.getByRole('checkbox', { name: /j'accepte le règlement/i }));
  if (newsletter) {
    await user.click(
      screen.getByRole('checkbox', { name: /je souhaite recevoir la newsletter/i }),
    );
  }
}

function renderInscription() {
  return renderPage(<Inscription />, {
    route: '/inscription',
    path: '/inscription',
    routes: [
      { path: '/connexion', element: <p>Page connexion</p> },
      { path: '/profil', element: <p>Page profil</p> },
    ],
  });
}

function mockGoogleSdk() {
  const initialize = vi.fn();
  window.google = {
    accounts: {
      id: {
        initialize,
        renderButton: vi.fn(),
      },
    },
  };
  return { initialize };
}

describe('Inscription', () => {
  it('affiche le formulaire de création de compte', () => {
    renderInscription();

    expect(
      screen.getByRole('heading', { name: 'Créer mon compte' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Connectez-vous' })).toHaveAttribute(
      'href',
      '/connexion',
    );
  });

  it('affiche les erreurs de validation si le formulaire est vide', async () => {
    const user = userEvent.setup();
    renderInscription();

    await user.click(
      screen.getByRole('button', { name: /créer mon compte et participer/i }),
    );

    expect(screen.getByText('Le prénom est obligatoire.')).toBeInTheDocument();
    expect(screen.getByText('Le nom est obligatoire.')).toBeInTheDocument();
    expect(screen.getByText("L'adresse e-mail est obligatoire.")).toBeInTheDocument();
    expect(
      screen.getByText('Vous devez accepter le règlement du jeu pour participer.'),
    ).toBeInTheDocument();
  });

  it('refuse un mot de passe trop court', async () => {
    const user = userEvent.setup();
    renderInscription();

    await remplirFormulaire(user, { motDePasse: 'Ab1!' });
    await user.click(
      screen.getByRole('button', { name: /créer mon compte et participer/i }),
    );

    expect(
      screen.getByText('Le mot de passe doit contenir au moins 8 caractères.'),
    ).toBeInTheDocument();
  });

  it('refuse deux mots de passe différents', async () => {
    const user = userEvent.setup();
    renderInscription();

    await remplirFormulaire(user, {
      motDePasse: 'Password1!',
      confirmation: 'AutrePass1!',
    });
    await user.click(
      screen.getByRole('button', { name: /créer mon compte et participer/i }),
    );

    expect(
      screen.getByText('Les mots de passe ne correspondent pas.'),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('envoie le consentement newsletter à l’API', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'user-1', email: 'jean@example.com' }),
    });

    renderInscription();
    await remplirFormulaire(user, { newsletter: true });
    await user.click(
      screen.getByRole('button', { name: /créer mon compte et participer/i }),
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const corps = JSON.parse(fetch.mock.calls[0][1].body);
    expect(corps.newsletter).toBe(true);
    expect(corps.firstName).toBe('Jean');
    expect(corps.email).toBe('jean@example.com');
  });

  it('redirige vers la connexion si le compte est créé sans token', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'user-1', email: 'jean@example.com' }),
    });

    renderInscription();
    await remplirFormulaire(user);
    await user.click(
      screen.getByRole('button', { name: /créer mon compte et participer/i }),
    );

    await waitFor(() => {
      expect(screen.getByText('Page connexion')).toBeInTheDocument();
    });
  });

  it('enregistre le token et redirige vers le profil', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'jwt-inscription',
        user: { email: 'jean@example.com' },
      }),
    });

    renderInscription();
    await remplirFormulaire(user);
    await user.click(
      screen.getByRole('button', { name: /créer mon compte et participer/i }),
    );

    await waitFor(() => {
      expect(screen.getByText('Page profil')).toBeInTheDocument();
    });
    expect(sessionStorage.getItem('token')).toBe('jwt-inscription');
  });
});

describe('Inscription via Google', () => {
  async function renderAvecGoogle() {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'google-client-test');
    vi.resetModules();
    const { default: InscriptionGoogle } = await import('./Inscription.jsx');
    const { renderPage: render } = await import('../test/renderPage.jsx');
    const google = mockGoogleSdk();

    render(<InscriptionGoogle />, {
      route: '/inscription',
      path: '/inscription',
      routes: [{ path: '/profil', element: <p>Page profil</p> }],
    });

    return google;
  }

  it('enregistre le token Google et redirige vers le profil', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'jwt-google',
        user: { email: 'jean.google@example.com' },
      }),
    });

    const { initialize } = await renderAvecGoogle();
    await waitFor(() => expect(initialize).toHaveBeenCalled());

    await act(async () => {
      await initialize.mock.calls[0][0].callback({ credential: 'google-jwt' });
    });

    await waitFor(() => {
      expect(screen.getByText('Page profil')).toBeInTheDocument();
    });
    expect(sessionStorage.getItem('token')).toBe('jwt-google');
  });

  it('affiche une erreur si l’inscription Google échoue', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Inscription Google échouée' }),
    });

    const { initialize } = await renderAvecGoogle();
    await waitFor(() => expect(initialize).toHaveBeenCalled());

    await act(async () => {
      await initialize.mock.calls[0][0].callback({ credential: 'google-jwt' });
    });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Inscription Google échouée',
    );
  });
});
