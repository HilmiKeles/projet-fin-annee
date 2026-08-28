// Paramètres du jeu-concours. À terme, ces valeurs viendront de l'API.
export const DUREE_JOURS = 30;
export const DATE_OUVERTURE = new Date('2026-08-27T00:00:00');
export const DATE_CLOTURE = new Date(
  DATE_OUVERTURE.getTime() + DUREE_JOURS * 24 * 60 * 60 * 1000,
);

export function joursAvantCloture(maintenant = new Date()) {
  const restant = Math.ceil((DATE_CLOTURE - maintenant) / (24 * 60 * 60 * 1000));
  return Math.max(0, restant);
}

export function dateClotureLisible() {
  return DATE_CLOTURE.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
