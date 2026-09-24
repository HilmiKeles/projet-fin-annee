import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MotDePasseOublie from './MotDePasseOublie.jsx';
import { renderPage } from '../test/renderPage.jsx';

function renderOubli() {
  return renderPage(<MotDePasseOublie />, {
    route: '/mot-de-passe-oublie',
    path: '/mot-de-passe-oublie',
  });
}

describe('Mot de passe oublié', () => {
  it('affiche le formulaire et le retour vers la connexion', () => {
    renderOubli();

    expect(
      screen.getByRole('heading', { name: 'Mot de passe oublié' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/adresse e-mail/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /retour à la connexion/i }),
    ).toHaveAttribute('href', '/connexion');
  });

  it('confirme l’envoi sans afficher le lien de réinitialisation', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message:
          "Si un compte existe pour cette adresse, un e-mail de réinitialisation vient d'être envoyé.",
      }),
    });

    renderOubli();
    await user.type(screen.getByLabelText(/adresse e-mail/i), 'jean@example.com');
    await user.click(screen.getByRole('button', { name: /envoyer l'e-mail/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/e-mail/i);
    expect(
      screen.queryByRole('link', { name: /choisir un nouveau mot de passe/i }),
    ).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/forgot-password',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'jean@example.com' }),
      }),
    );
  });

  it('affiche une erreur si la demande est refusée', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Adresse e-mail invalide.' }),
    });

    renderOubli();
    await user.type(screen.getByLabelText(/adresse e-mail/i), 'jean@example.com');
    await user.click(screen.getByRole('button', { name: /envoyer l'e-mail/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Adresse e-mail invalide.',
      );
    });
  });
});
