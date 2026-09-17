import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPage from './ContactPage.jsx';
import { renderPage } from '../test/renderPage.jsx';

describe('ContactPage', () => {
  it('affiche les coordonnées et le formulaire', () => {
    renderPage(<ContactPage />);

    expect(screen.getByRole('heading', { name: 'Nous contacter' })).toBeInTheDocument();
    expect(screen.getByText('contact@thetiptop.com')).toBeInTheDocument();
    expect(screen.getByText('18 rue Léon Frot')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Envoyer le message' }),
    ).toBeInTheDocument();
  });

  it('affiche un message de confirmation après envoi', async () => {
    const user = userEvent.setup();
    renderPage(<ContactPage />);

    await user.type(screen.getByLabelText(/prénom/i), 'Jean');
    await user.type(screen.getByLabelText(/^nom/i), 'Dupont');
    await user.type(screen.getByLabelText(/email/i), 'jean@example.com');
    await user.selectOptions(
      screen.getByLabelText(/sujet/i),
      'Question sur le jeu-concours',
    );
    await user.type(screen.getByLabelText(/message/i), 'Bonjour, j’ai une question.');
    await user.click(screen.getByRole('button', { name: 'Envoyer le message' }));

    expect(
      screen.getByRole('heading', { name: 'Message envoyé !' }),
    ).toBeInTheDocument();
  });
});
