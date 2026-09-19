import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReportIssuePage from './ReportIssuePage.jsx';
import { renderPage } from '../test/renderPage.jsx';

describe('ReportIssuePage', () => {
  it('désactive l’envoi tant que le type et le consentement manquent', () => {
    renderPage(<ReportIssuePage />, {
      route: '/signaler-probleme',
      path: '/signaler-probleme',
    });

    expect(
      screen.getByRole('heading', { name: 'Signaler un problème' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Envoyer le signalement' }),
    ).toBeDisabled();
  });

  it('affiche un numéro de ticket après envoi', async () => {
    const user = userEvent.setup();
    renderPage(<ReportIssuePage />, {
      route: '/signaler-probleme',
      path: '/signaler-probleme',
    });

    await user.selectOptions(screen.getByLabelText(/type de problème/i), 'site-web');
    await user.type(
      screen.getByLabelText(/description détaillée/i),
      'La page de connexion ne s’affiche plus depuis ce matin.',
    );
    await user.type(screen.getByLabelText(/email de contact/i), 'jean@example.com');
    await user.click(
      screen.getByRole('checkbox', { name: /j'accepte que mes données/i }),
    );
    await user.click(screen.getByRole('button', { name: 'Envoyer le signalement' }));

    expect(
      screen.getByRole('heading', { name: 'Signalement envoyé' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/TT-/i)).toBeInTheDocument();
  });
});
