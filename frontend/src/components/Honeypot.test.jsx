import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Honeypot from './Honeypot.jsx';
import { CHAMP_HONEYPOT, MESSAGE_ROBOT, estRobot } from '../utils/honeypot';
import Connexion from '../pages/Connexion.jsx';
import { renderPage } from '../test/renderPage.jsx';

describe('Honeypot', () => {
  it('reste invisible et inaccessible pour les utilisateurs', () => {
    const { container } = render(<Honeypot />);

    const conteneur = container.querySelector('.honeypot');
    const caseInvisible = container.querySelector(
      `input[name="${CHAMP_HONEYPOT}"]`,
    );

    expect(conteneur).toHaveAttribute('aria-hidden', 'true');
    expect(caseInvisible).toHaveAttribute('type', 'checkbox');
    expect(caseInvisible).toHaveAttribute('tabindex', '-1');
    expect(caseInvisible).not.toBeChecked();
    // Masquée pour les lecteurs d'écran : absente de l'arbre d'accessibilité
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('identifie une case cochée comme robot', () => {
    expect(estRobot(true)).toBe(true);
    expect(estRobot(false)).toBe(false);
    expect(estRobot(undefined)).toBe(false);
  });
});

describe('Protection anti-robot sur la connexion', () => {
  function renderConnexion() {
    return renderPage(<Connexion />, {
      route: '/connexion',
      path: '/connexion',
      routes: [{ path: '/', element: <p>Page accueil</p> }],
    });
  }

  it('refuse la soumission si la case invisible est cochée', async () => {
    const user = userEvent.setup();
    const { container } = renderConnexion();

    await user.type(screen.getByLabelText(/adresse e-mail/i), 'robot@example.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'Password1!');

    // Un robot coche la case piège que les humains ne voient pas
    const caseInvisible = container.querySelector(
      `input[name="${CHAMP_HONEYPOT}"]`,
    );
    await user.click(caseInvisible);

    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(MESSAGE_ROBOT);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('laisse passer la soumission quand la case invisible reste décochée', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'jwt-test', user: { email: 'jean@example.com' } }),
    });

    renderConnexion();

    await user.type(screen.getByLabelText(/adresse e-mail/i), 'jean@example.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'Password1!');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText('Page accueil')).toBeInTheDocument();
    const corps = JSON.parse(fetch.mock.calls[0][1].body);
    expect(corps[CHAMP_HONEYPOT]).toBeUndefined();
  });
});
