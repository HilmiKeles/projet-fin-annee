import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotFound from './NotFound.jsx';
import Admin from './Admin.jsx';
import Employe from './Employe.jsx';
import { renderPage } from '../test/renderPage.jsx';

const gagnants = [
  {
    id: 'g1',
    prize: 'infuseur',
    code: 'ABCDEFGHIJ',
    claimed: false,
    wonAt: '2026-03-15T10:00:00.000Z',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie@example.com',
  },
  {
    id: 'g2',
    prize: 'coffret69',
    code: 'KLMNOPQRST',
    claimed: true,
    wonAt: '2026-03-10T10:00:00.000Z',
    firstName: 'Paul',
    lastName: 'Durand',
    email: 'paul@example.com',
  },
];

function mockListeGains() {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ gains: gagnants }),
  });
}

describe('NotFound', () => {
  it('propose de revenir à l’accueil', () => {
    renderPage(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /cette page a été infusée trop longtemps/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: "Retour à l'accueil" })).toHaveAttribute(
      'href',
      '/',
    );
  });
});

describe('Admin', () => {
  it('affiche le titre de l’espace administrateur', () => {
    renderPage(<Admin />);

    expect(
      screen.getByRole('heading', { name: 'Administration' }),
    ).toBeInTheDocument();
  });

  it('crée un employé depuis le back-office', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('token', 'jwt-admin');
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ticketsTotal: 0,
          ticketsUsed: 0,
          totalGains: 0,
          totalClients: 0,
          gagnantsParSexe: {},
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clients: [], abonnesNewsletter: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ employes: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          cree: true,
          message: 'Compte créé : employe@example.com. Connexion sur /employe.',
          employe: {
            id: 'emp-1',
            email: 'employe@example.com',
            firstName: 'Employe',
            lastName: 'Boutique',
          },
        }),
      });

    renderPage(<Admin />);

    expect(
      await screen.findByRole('heading', { name: 'Créer un employé boutique' }),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText('E-mail'), 'employe@example.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'MotDePasse1!');
    await user.click(screen.getByRole('button', { name: "Créer l'employé" }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      /compte créé : employe@example.com/i,
    );
    expect(screen.getByText(/Employe Boutique/)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/admin/employes',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'employe@example.com',
          password: 'MotDePasse1!',
        }),
      }),
    );
  });
});

describe('Employe', () => {
  it('affiche le formulaire de connexion employé', () => {
    renderPage(<Employe />);

    expect(screen.getByRole('heading', { name: 'Espace employé' })).toBeInTheDocument();
    expect(
      screen.getByText(/voir les gagnants et marquer les lots remis/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/adresse e-mail/i)).toBeInTheDocument();
  });

  it('refuse un compte client', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'jwt-client',
        role: 'CLIENT',
        user: { email: 'jean@example.com', role: 'CLIENT' },
      }),
    });

    renderPage(<Employe />);
    await user.type(screen.getByLabelText(/adresse e-mail/i), 'jean@example.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'Password1!');
    await user.click(
      screen.getByRole('button', { name: /accéder à l'espace employé/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /n'a pas les droits employé/i,
    );
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  it('liste qui a gagné quoi après connexion employé', async () => {
    const user = userEvent.setup();
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: 'jwt-emp',
          role: 'EMPLOYEE',
          user: { email: 'employe@example.com', role: 'EMPLOYEE' },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ gains: gagnants }),
      });

    renderPage(<Employe />);
    await user.type(
      screen.getByLabelText(/adresse e-mail/i),
      'employe@example.com',
    );
    await user.type(screen.getByLabelText(/mot de passe/i), 'Password1!');
    await user.click(
      screen.getByRole('button', { name: /accéder à l'espace employé/i }),
    );

    expect(
      await screen.findByRole('heading', { name: 'Gagnants et remises' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Marie Martin')).toBeInTheDocument();
    expect(screen.getByText('marie@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Infuseur à thé/)).toBeInTheDocument();
    expect(screen.getByText('ABCDEFGHIJ')).toBeInTheDocument();
    expect(screen.getByText('Paul Durand')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Marquer remis' })).toBeInTheDocument();
  });

  it('filtre par nom et marque un lot comme remis', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('token', 'jwt-emp');
    mockListeGains();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Gain marqué comme remis',
        gain: { id: 'g1', claimed: true },
      }),
    });

    renderPage(<Employe />);

    expect(
      await screen.findByRole('heading', { name: 'Gagnants et remises' }),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/rechercher un gagnant/i), 'marie');
    expect(screen.getByText('Marie Martin')).toBeInTheDocument();
    expect(screen.queryByText('Paul Durand')).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText(/rechercher un gagnant/i));
    await user.click(screen.getByRole('button', { name: 'Marquer remis' }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Marquer remis' })).not.toBeInTheDocument();
    });
    expect(fetch).toHaveBeenCalledWith(
      '/api/admin/gain/g1/claim',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });
});
