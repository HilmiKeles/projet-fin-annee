import { screen } from '@testing-library/react';
import Reglement from './Reglement.jsx';
import CGU from './CGU.jsx';
import MentionsLegales from './MentionsLegales.jsx';
import Confidentialite from './Confidentialite.jsx';
import { renderPage } from '../test/renderPage.jsx';

describe('pages légales', () => {
  it('affiche le règlement du jeu-concours', () => {
    renderPage(<Reglement />);

    expect(
      screen.getByRole('heading', { name: 'Règlement du jeu-concours' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/jeu-concours fictif/i)).toBeInTheDocument();
    expect(screen.getByText(/article 1/i)).toBeInTheDocument();
  });

  it('affiche les CGU', () => {
    renderPage(<CGU />);

    expect(
      screen.getByRole('heading', {
        name: /conditions générales d'utilisation/i,
      }),
    ).toBeInTheDocument();
  });

  it('affiche les mentions légales', () => {
    renderPage(<MentionsLegales />);

    expect(screen.getByRole('heading', { name: 'Mentions légales' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /projet étudiant fictif/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/18 rue Léon Frot/i).length).toBeGreaterThan(0);
  });

  it('affiche la politique de confidentialité', () => {
    renderPage(<Confidentialite />);

    expect(
      screen.getByRole('heading', { name: 'Politique de confidentialité' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /responsable du traitement/i }),
    ).toBeInTheDocument();
  });
});
