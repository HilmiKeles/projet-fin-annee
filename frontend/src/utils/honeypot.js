/** Nom du champ piège (case à cocher invisible) partagé avec l'API. */
export const CHAMP_HONEYPOT = "confirmationHumaine";

/** Message affiché lorsque le piège anti-robot est déclenché. */
export const MESSAGE_ROBOT =
  "Accès refusé : cette demande a été identifiée comme automatisée.";

/**
 * Indique si la case piège a été cochée, donc si la soumission est robotisée.
 * Un visiteur humain ne voit ni n'atteint jamais cette case.
 */
export function estRobot(valeur) {
  return valeur === true;
}
