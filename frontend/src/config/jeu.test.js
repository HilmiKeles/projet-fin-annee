import { describe, expect, it } from 'vitest';
import {
  DATE_CLOTURE,
  DATE_OUVERTURE,
  DUREE_JOURS,
  dateClotureLisible,
  joursAvantCloture,
} from './jeu.js';

describe('configuration du jeu-concours', () => {
  it('fixe la durée officielle à 30 jours', () => {
    expect(DUREE_JOURS).toBe(30);
  });

  it('place la clôture 30 jours après l’ouverture', () => {
    expect(DATE_CLOTURE.getTime()).toBe(
      DATE_OUVERTURE.getTime() + DUREE_JOURS * 24 * 60 * 60 * 1000,
    );
  });

  it('retourne 0 jour restant après la clôture', () => {
    expect(joursAvantCloture(new Date('2030-01-01T00:00:00'))).toBe(0);
  });

  it('calcule les jours restants avant la clôture', () => {
    const cinqJoursAvant = new Date(
      DATE_CLOTURE.getTime() - 5 * 24 * 60 * 60 * 1000,
    );
    expect(joursAvantCloture(cinqJoursAvant)).toBe(5);
  });

  it('formate la date de clôture avec le jour et l’année', () => {
    const texte = dateClotureLisible();
    expect(texte).toMatch(/26/);
    expect(texte).toMatch(/2026/);
  });
});
