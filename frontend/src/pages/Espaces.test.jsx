import { screen } from '@testing-library/react';
import NotFound from './NotFound.jsx';
import Admin from './Admin.jsx';
import Employe from './Employe.jsx';
import { renderPage } from '../test/renderPage.jsx';

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
      screen.getByRole('heading', { name: 'Espace administrateur' }),
    ).toBeInTheDocument();
  });
});

describe('Employe', () => {
  it('affiche le titre de l’espace employé', () => {
    renderPage(<Employe />);

    expect(screen.getByRole('heading', { name: 'Espace employé' })).toBeInTheDocument();
    expect(screen.getByText(/remise des lots/i)).toBeInTheDocument();
  });
});
