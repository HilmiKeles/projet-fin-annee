import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReinitialiserMotDePasse from './ReinitialiserMotDePasse.jsx';
import { renderPage } from '../test/renderPage.jsx';

function renderReset(route = '/reinitialiser-mot-de-passe?token=jeton-test') {
  return renderPage(<ReinitialiserMotDePasse />, {
    route,
    path: '/reinitialiser-mot-de-passe',
  });
}

describe('Réinitialiser le mot de passe', () => {
  it('signale un lien incomplet', () => {
    renderReset('/reinitialiser-mot-de-passe');

    expect(screen.getByRole('alert')).toHaveTextContent(/lien est incomplet/i);
    expect(
      screen.queryByLabelText(/nouveau mot de passe/i),
    ).not.toBeInTheDocument();
  });

  it('refuse deux mots de passe différents', async () => {
    const user = userEvent.setup();
    renderReset();

    await user.type(screen.getByLabelText(/^nouveau mot de passe$/i), 'Password1!');
    await user.type(
      screen.getByLabelText(/confirmer le mot de passe/i),
      'AutrePass1!',
    );
    await user.click(
      screen.getByRole('button', { name: /enregistrer le mot de passe/i }),
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/ne correspondent pas/i);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('enregistre le nouveau mot de passe', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Votre mot de passe a été mis à jour.' }),
    });

    renderReset();
    await user.type(screen.getByLabelText(/^nouveau mot de passe$/i), 'Password1!');
    await user.type(
      screen.getByLabelText(/confirmer le mot de passe/i),
      'Password1!',
    );
    await user.click(
      screen.getByRole('button', { name: /enregistrer le mot de passe/i }),
    );

    expect(await screen.findByRole('status')).toHaveTextContent(/mis à jour/i);
    expect(
      screen.getByRole('link', { name: /se connecter/i }),
    ).toHaveAttribute('href', '/connexion');
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/auth/reset-password',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ token: 'jeton-test', password: 'Password1!' }),
        }),
      );
    });
  });
});
